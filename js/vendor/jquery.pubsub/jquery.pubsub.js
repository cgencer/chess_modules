/*! jquery.pubsub.js v0.1.0 | felixexter | MIT | https://github.com/felixexter/jquery.pubsub */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		factory(require('jquery'));
	} else {
		factory(jQuery);
	}
}(function ($) {
	var $pubsub = $({});

	$.each(['on', 'one', 'off', 'trigger'], function (i, method) {
		$[method] = $.proxy($pubsub[method], $pubsub);
	});
}));
