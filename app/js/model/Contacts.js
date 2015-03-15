var Contacts = Backbone.Collection.extend({
    model: Contact,
    initialize: function () {
        var that = this;
        this.listenTo(App.vent, 'notifications-reset', function () {
            that.trigger('reset');
        });
    },
    parse: function (response) {
        return response.contacts;
    },
    url: 'http://192.168.2.8:8080/contacts/'
});