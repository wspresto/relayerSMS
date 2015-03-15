var Message = Backbone.Model.extend({
    defaults: {
        author: 'Me',//special author name
        recipient: '',
        content: '',
        timestamp: '',
        number: '',
        isInBoundMessage: false,
        isUnRead: false
    },
    initialize: function () {

    },
    parse: function (response) {
        response.isInBoundMessage = (response.recipient === 'Me');
        return response;
    },
    url: 'http://192.168.2.8:8080/message/'
});