var MessageBoardItemView = Backbone.Marionette.ItemView.extend({
    className: 'txt-msg-box',
    initialize: function(args) {
        //composite view gives this view its template and model
        this.template = _.template(args.html);
    },
    templateHelpers: {
        getTime: function () {
            if (this.timestamp) {
                var pieces = this.timestamp.split(' ');
                return pieces[1];
            } else {
                return '';
            }
        },
        isInboundMessage: function () {
            return this.isInBoundMessage;
        }
    }
});