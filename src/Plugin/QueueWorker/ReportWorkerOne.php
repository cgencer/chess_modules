<?php

namespace Drupal\chess_ukd\Plugin\QueueWorker;
require('XLSXReader.php');

/**
 * A report worker.
 *
 * @QueueWorker(
 *   id = "cron_example_queue_2",
 *   title = @Translation("Second worker in cron_example"),
 *   cron = {"time" = 20}
 * )
 *
 * QueueWorkers are new in Drupal 8. They define a queue, which in this case
 * is identified as cron_example_queue_2 and contain a process that operates on
 * all the data given to the queue.
 *
 * @see queue_example.module
 */
class ReportWorkerOne extends ReportWorkerBase {
	/**
	 * {@inheritdoc}
	 */

	// $types = ['ukd', 'uhs', 'uys'];
	protected $zipArc = 'http://ukd.tsf.org.tr/ukdlistesi/'.'ukd'.'_listesi_'.'20180901'.'.zip';
	protected $tempFile = 'ukd_list.zip';

	public function processItem($data) {
		$this->chess_ukd_cron();
		$this->reportWork(2, $data);
	}

	public function grabFiles() {
		set_time_limit(0);
 
		//File to save the contents to
		$fp = fopen ($this->tempFile, 'w+');
 		$url = $this->zipArc;
 
		//Here is the file we are downloading, replace spaces with %20
		$ch = curl_init(str_replace(" ","%20", $url));
		curl_setopt($ch, CURLOPT_TIMEOUT, 50);
 		//give curl the file pointer so that it can write to it
		curl_setopt($ch, CURLOPT_FILE, $fp);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
 		$data = curl_exec($ch);				//get curl response
		curl_close($ch);
	}

	public function retrieveZip(){
		$xlsx = new XLSXReader($this->tempFile);
		$sheets = $xlsx->getSheetNames();
		$data = $xlsx->getSheetData('Sales');
	}

	public function chess_ukd_cron() {
		// We access our configuration.
		$cron_config = \Drupal::configFactory()->getEditable('chess_ukd.settings');
		// Default to an hourly interval. Of course, cron has to be running at least
		// hourly for this to work.
		$interval = $cron_config->get('interval');
		$interval = !empty($interval) ? $interval : 3600;

		// We usually don't want to act every time cron runs (which could be every
		// minute) so keep a time for the next run in the site state.
		$next_execution = \Drupal::state()->get('chess_ukd.next_execution');
		$next_execution = !empty($next_execution) ? $next_execution : 0;
		if (REQUEST_TIME >= $next_execution) {
			// This is a silly example of a cron job.
			// It just makes it obvious that the job has run without
			// making any changes to your database.
			\Drupal::logger('chess_ukd')->notice('Chess-UKD ran');
			if (\Drupal::state()->get('chess_ukd_show_status_message')) {
				\Drupal::messenger()->addMessage(t('Chess-UKD executed at %time', ['%time' => date_iso8601(REQUEST_TIME)]));
				\Drupal::state()->set('chess_ukd_show_status_message', FALSE);
			}
			\Drupal::state()->set('chess_ukd.next_execution', REQUEST_TIME + $interval);
		}
	}
}
