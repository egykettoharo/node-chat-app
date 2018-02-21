var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {

    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = $('<li></li>');
    li.text(message.from + ' ' + formattedTime + ': ' + message.text);
    $('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = $('<li></li>');
    li.html(message.from + ' ' + formattedTime + ': <a target="_blank" href="' + message.url + '">Location</a>');
    $('#messages').append(li);
});

(function($) {
    $('#message-form').on('submit', function(e) {
         e.preventDefault();

        var input = $(this).find('input[name="message"]');

        socket.emit('createMessage', {
            from: 'User',
            text: input.val()
        }, function() {
            input.val('');
        });
    });

    var locationButton = $('#send-location');

    locationButton.on('click', function() {
        if(!navigator.geolocation) {
            return alert('Geolocation not supperted by your browser.');
        }

        locationButton.attr('disabled', 'disabled').text('Sending location...');

        navigator.geolocation.getCurrentPosition(function(position) {
            locationButton.removeAttr('disabled').text('Send location');
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function() {
            locationButton.removeAttr('disabled').text('Send location');
            alert('Unable to fetch your location');
        });
    });
})(jQuery);