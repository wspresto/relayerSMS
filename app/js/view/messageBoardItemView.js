var MessageBoardItemView = Backbone.Marionette.extend({
    class: 'txt-msg-box',
    initialize: function(args) {
        //composite view gives this view its template and model
    },
    templateHelpers: {
        getTime: function () {
            var pieces = this.timestamp.split(':');
            return pieces[0];
        }
    }
});