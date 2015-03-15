var OldMessages = Backbone.Collection.extend({
    model: Message,
    initialize: function () {
    },
    parse: function (response) {
        return response.messages;
    },
    url: 'http://192.168.2.8:8080/messages-history/'
});