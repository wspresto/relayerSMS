var Contact = Backbone.Model.extend({
    defaults: {
        author: '',
        id: '',
        notifications: 0
    },
    initialize: function () {
        this.listenTo(App.vent, 'message-new', this.increaseNotifications);
    },
    markAllAsRead: function () {
        this.set('notifications', 0);
    },
    increaseNotifications: function (id) {
        if (id === this.get('id')) {
            this.set('notifications', this.get('notifications') + 1);
            this.trigger('change');
        } //ELSE ignore
    }
});