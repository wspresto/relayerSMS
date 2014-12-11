var Message = Backbone.Model.extend({
    defaults: {
        author: 'Me',//special author name
        recipient: '',
        content: '',
        timestamp: '',
        number: '',
        isInBoundMessage: false
    },
    initialize: function () {

    },
    parse: function (response) {
        response.isInBoundMessage = (response.recipient === 'Me');
        return response;
    }
});