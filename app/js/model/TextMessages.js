var Messages = Backbone.Collection.extend({
    model: Message,
    initialize: function () {
    },
    parse: function (response) {
        return response.messages;
    },
    url: 'http://192.168.1.4:8080/messages/'
});