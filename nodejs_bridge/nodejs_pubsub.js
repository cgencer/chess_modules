(function ($, Drupal, drupalSettings) {

  Drupal.ChessPubSub = {
	var notifyTime = drupalSettings.nodejs_notify.notification_time;

	$.on('chessPubSub', function (e, data) {
    	console.log('First message!', data);
		if (notifyTime > 0) {
			$.jGrowl(data, {header: 'Game Invitation', sticky:true});
		}
	});

	// Publish some data
	$.trigger('chessPubSub', 'Hello!');

	// Unsubcribe from 'sendMessage'
	// $.off('chessPubSub');

  };

})(jQuery, Drupal, drupalSettings);

