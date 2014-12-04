var Messages = Backbone.Collection.extend({
    model: Message,
    initialize: function (args) {
        this.url = args.url;
    },
    parse: function (response) {
        return response.messages;
    }
});