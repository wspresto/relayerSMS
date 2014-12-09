var recepient = '';
var MessageBoardCompositeView = Backbone.Marionette.CompositeView.extend({
    childViewContainer: '#msg-board',
    initialize: function (args) {
        this.template      = _.template(args.html);
        this.childViewHtml = args.childViewHtml;
        this.emptyViewHtml = args.emptyViewHtml;
        this.emptyView     = args.emptyView;
        this.messages      = args.messages;
        this.listenTo(this.messages, 'reset', this.refresh);
        this.listenTo(App.vent, 'contact-select', this.updateMessageRecepient);
    },
    filter: '',
    events: {
        'click #sync-btn': 'syncWithServer'
    },
    onBeforeRender: function () {
        this.collection = new Backbone.Collection(this.messages.where({number: this.filter}));
    },
    refresh: function () {
        App.vent.trigger('messages-reset');
        this.render();
    },
    updateMessageRecepient: function (id, name) {
        recepient = name;
    },
    syncWithServer: function () {
        this.messages.fetch({reset: true});
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
    },
    templateHelpers: {
        getRecepient: function () {
            return recepient;
        }
    }
});