(function ($, _, Drupal, drupalSettings) {

	if(!Drupal.behaviors.chessPOBox) {
		Drupal.behaviors.chessPOBox = {

			poBoxes: {},

			attach: function (context, settings) {

				//var notifyTime = drupalSettings.nodejs_notify.notification_time;
				var notifyTime = 100;

				$.on('chessPubSub:::invite', function (e, data) {

					if (notifyTime > 0) {
						$.jGrowl(data, {
							header: 'Game Invitation', 
							sticky: false
						});
					}
				});

				$.on('chessPubSub:::getBoardData', function (e, data) {

					// if the board registered itsef here -> REGISTER THE MODULES in here.

					// contact the boards authorities and ask the data

				});


				// Publish some data

				// Unsubcribe from 'sendMessage'
				// $.off('chessPubSub');

			},

			toBoxes: function () {
				this.poBoxes
			}
		}
	}

})(jQuery, _, Drupal, drupalSettings);


// if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
