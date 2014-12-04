var MessageBoardCompositeView = Backbone.Marionette.CompositeView.extend({
    id: 'message-board-composite-view',
    childView: MessageBoardItemView,
    childViewContainer: '#msg-board',
    initialize: function (args) {
        this.template      = args.template;
        this.model         = args.model;
        this.collection    = args.collection;
        this.childTemplate = args.childTemplate;

        this.listenTo(this.collection, 'reset', function () {
            console.log('Collection has reset. Message Board will now render.');
            this.render();
        });
    },
    childViewOptions: function () {
        return {
            template: this.childTemplate
        };
    }
});