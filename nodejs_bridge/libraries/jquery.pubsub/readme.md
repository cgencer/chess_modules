# jquery.pubsub.js

Pub/Sub implementation for jQuery.

## Use
- Set jQuery & jQuery.PubSub.js.
```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="jquery.pubsub.min.js"></script>
```

- Init plugin.
```javascript
// Subscribe to 'sendMessage'
$.on('sendMessage', function (e, data) {
    console.log('First message!', data);
});

// Subscribe one time to 'sendMessage'
$.one('sendMessage', function (e, data) {
    console.log('New message!', data);
});

// Publish some data
$.trigger(sendMessage, 'Hello!');

// Or without them
$.trigger(sendMessage);

// Unsubcribe from 'sendMessage'
$.off('sendMessage');
```

## License

Released under the MIT license.
