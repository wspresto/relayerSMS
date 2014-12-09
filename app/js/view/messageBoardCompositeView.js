var recepientName = '';
var recepientId   = '';
var MessageBoardCompositeView = Backbone.Marionette.CompositeView.extend({
    childViewContainer: '#msg-board',
    initialize: function (args) {
        this.template       = _.template(args.html);
        this.childViewHtml  = args.childViewHtml;
        this.emptyViewHtml  = args.emptyViewHtml;
        this.emptyView      = args.emptyView;
        this.messages       = args.messages;
        this.messageHistory = args.messageHistory;
        this.listenTo(this.messages, 'reset', this.refresh);
        this.listenTo(App.vent, 'contact-select', this.updateMessageRecepient);
    },
    events: {
        'click #sync-btn': 'syncWithServer',
        'click #send-btn': 'sendTxtMsg'
    },
    messageHistory: null, //sms from before the server...
    onBeforeRender: function () {
        var sent = this.messageHistory.where({number: recepientId});
        var got  = this.messageHistory.where({author: recepientName});
        var all  = sent.concat(got);
        all      = all.concat(this.messages.models);
        this.collection = new Backbone.Collection(all);
    },
    refresh: function () {
        App.vent.trigger('messages-reset');
        this.render();
    },
    updateMessageRecepient: function (id, name) {
        recepientName = name;
        recepientId   = id;
    },
    syncWithServer: function () {
        this.messages.fetch({reset: true, async : false}); //preserve all/old sms
        this.messages.add(this.messageHistory.models);
        this.messages.trigger('reset');
    },
    sendTxtMsg: function () {
        App.vent.trigger('send-sms', recepientId);
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
            return recepientName;
        }
    }
});