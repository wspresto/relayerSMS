var Messages = Backbone.Collection.extend({
    model: Message,
    initialize: function () {

    },
    url: function () {
        return 'http://192.168.1.4:8080';
    },
    parse: function (response) {
        return response.messages;
    }
});