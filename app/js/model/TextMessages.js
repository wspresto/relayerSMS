var Messages = Backbone.Collection.extend({
    model: Message,
    initialize: function () {
        this.on('reset', this.updateContactNotifications);
    },
    parse: function (response) {
        return response.messages;
    },
    url: 'http://192.168.1.4:8080/messages/',
    historyUrl: 'http://192.168.1.4:8080/messages-history/',
    oldMessagesFetch: function () {
        this.fetch({
            url: this.historyUrl,
            reset: false
        });
    },
    updateContactNotifications : function () {
        if (App.messages.length < 1) {
            return;
        }
        //update contact models with new contact notification values
        //DONE: trigger a reset notifications event for all listening contact views
        var id    = '';
        var isUnRead = '';
        for(var m = 0; m < messages.length; m++) {
            id = App.messages.at(m).get('number');
            isUnRead = App.messages.at(m).get('isUnRead');
            //DONE: for all messages marked as unread trigger a new-message with an argument of author id, thenn listening contact models can increase their notifications
            if (isUnRead) {
                App.vent.trigger('new-message', id);
            }
        }

        this.comparator = function (model) { return model.get('timestamp')};
        this.sort();
        App.vent.trigger('notification-reset'); //force render of contact queue
    }
});