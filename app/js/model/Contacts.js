var Contacts = Backbone.Collection.extend({
    model: Contact,
    initialize: function () {
    },
    parse: function (response) {
        return response.contacts;
    },
    url: 'http://192.168.1.4:8080/contacts/'
});