var ContactQueueCompositeView = Backbone.Marionette.CompositeView.extend({
    childViewContainer: '#contact-queue',
    initialize: function (args) {
        this.template      = _.template(args.html);
        this.childViewHtml     = args.childViewHtml;
        this.emptyViewHtml = args.emptyViewHtml;
        this.emptyView     = args.emptyView;
        this.listenTo(this.collection, 'reset', this.refresh);
        this.listenTo(App.vent, 'notification-reset', this.sortByNotifications);
        this.listenTo(App.vent, 'send-sms', this.sendTxtMsg);
        this.listenTo(App.vent, 'contact-select', this.updateSelectedContact);
    },
    selectedContact: null,
    sortByNotifications: function () {
        this.collection.comparator = function (model) { return -1 * model.get('notifications')};
        this.collection.sort();
        this.render();
    },
    refresh: function () {
        console.log('contacts fetched!');
    },
    updateSelectedContact: function (id, name) {
        this.selectedContact = this.collection.findWhere({id: id});
    },
    syncWithServer: function () {
        this.collection.fetch({reset: true});
    },
    sendTxtMsg: function (id) {
        if (this.selectedContact === null) {
            return;
        } else {
            var $txtTag = $('textarea');
            if ($txtTag.length > 0) {
                console.log('sending txt to:' + this.selectedContact.get('author'));
                console.log('txt:' + $txtTag.val());

            }
        }
    },
    childViewOptions: function () {
        var ct = this.childViewHtml;
        return {
            html: ct
        };
    },
    getEmptyView: function () {
        return this.emptyView;
    },
    emptyViewOptions: function () {
        return {
            html : this.emptyViewHtml
        }
    }
});