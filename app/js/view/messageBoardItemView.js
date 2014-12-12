var MessageBoardItemView = Backbone.Marionette.ItemView.extend({
    className: 'txt-msg-box',
    initialize: function(args) {
        //composite view gives this view its template and model
        this.template = _.template(args.html);
    },
    templateHelpers: {
        getTime: function () {
            var time = new Date(parseInt(this.timestamp)).toUTCString();
            if (time) {
                var pieces = time.split(' ');
                return pieces[0] + ' ' + pieces[1] + ' ' + pieces[2];
            } else {
                return '';
            }
        },
        isInboundMessage: function () {
            return this.isInBoundMessage;
        }
    }
});