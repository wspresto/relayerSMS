var MessageBoardCompositeView = Backbone.Marionette.LayoutView.extend({
    id: 'message-board-composite-view',
    initialize: function (args) {
        this.template = args.template;
        console.log('message board composite view is alive');
    }
});