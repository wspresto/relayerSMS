var Contact = Backbone.Model.extend({
    defaults: {
        author: '',
        id: '',
        notifications: 0
    },
    initialize: function () {
        this.listenTo(App.vent, 'messages-shown', this.markAllAsRead);
        this.listenTo(App.vent, 'messages-new', this.increaseNotifications);
    },
    markAllAsRead: function (id) {
        if (id === this.get('id')) {
            this.set('notifications', 0);
            this.trigger('change');
        }
    },
    increaseNotifications: function (id) {
        if (id === this.get('id')) {
            this.set('notifications', this.get('notifications') + 1);
            this.trigger('change');
        } //ELSE ignore
    }
});