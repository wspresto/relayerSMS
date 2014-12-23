var ContactQueueItemView = Backbone.Marionette.ItemView.extend({
    className: 'contact-box',
    initialize: function(args) {
        //composite view gives this view its template and model
        this.template = _.template(args.html);
        this.listenTo(App.vent, 'notifications-reset', this.render);
        this.listenTo(App.vent, 'contact-select', this.updateSelected);
    },
    events: {
        'click .click-box' : 'selectContact'
    },
    updateSelected: function (id, name) {
        var $tag = this.$el;
        if ($tag.length > 0) {
            $tag.removeClass('selected');
            if (this.model.get('id') === id) {
                $tag.addClass('selected');
            }
        }
    },
    selectContact: function () {
        var id = this.model.get('id');
        var author = this.model.get('author');
        App.vent.trigger('contact-select', id, author);
        App.vent.trigger('messages-shown', id);
    },
    templateHelpers: {
        getNotifications: function () {
            if (this.notifications > 0) {
                return '(' + this.notifications + ')';
            } else {
                return '';
            }
        }
    }
});