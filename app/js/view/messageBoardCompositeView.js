var MessageBoardCompositeView = Backbone.Marionette.CompositeView.extend({
    id: 'message-board-composite-view',
    childView: MessageBoardItemView,
    initialize: function (args) {
        this.template      = args.template;
        this.model         = args.model;
        this.collection    = args.collection;
        this.childTemplate = args.childTemplate;
        console.log('message board composite view is alive');
    },
    childViewOptions: function () {
        return {
            template: this.childTemplate
        };
    },
    onShow: function () {
        this.listenTo(this.collection, 'reset', function () {
            this.render();
        });
    }
});