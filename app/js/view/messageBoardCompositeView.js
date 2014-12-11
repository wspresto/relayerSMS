var recipientName = null;
var recipientId   = null;
var MessageBoardCompositeView = Backbone.Marionette.CompositeView.extend({
    childViewContainer: '#msg-board',
    initialize: function (args) {
        this.template       = _.template(args.html);
        this.childViewHtml  = args.childViewHtml;
        this.emptyViewHtml  = args.emptyViewHtml;
        this.emptyView      = args.emptyView;
        this.messages       = args.messages;
        this.messageHistory = args.messageHistory;
        this.listenTo(this.messages, 'reset', this.render);
        this.listenTo(this.messageHistory, 'reset', this.render); //do not trigger notifications for old messages
        this.listenTo(App.vent, 'contact-select', this.updateMessageRecepient);
    },
    events: {
        'click #sync-btn': 'syncWithServer',
        'click #send-btn': 'sendTxtMsg',
        'keypress textarea': 'submitMessage'
    },
    messageHistory: null, //sms from before the server...
    onBeforeRender: function () {
        var all = this.messageHistory.models;
        all = all.concat(this.messages.models);
        var filtered = new Backbone.Collection(all).where({number: recipientId});

        this.collection = new Backbone.Collection(filtered);
        this.collection.comparator = function (model) { return model.get('timestamp')};
        this.collection.sort();
    },
    submitMessage: function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#send-btn').click();
        }
    },
    updateMessageRecepient: function (id, name) {
        recipientName = name;
        recipientId   = id;
    },
    syncWithServer: function () {
        this.messages.fetch({reset: true, async : false}); //preserve all/old sms
        this.messages.trigger('reset');
        App.vent.trigger('messages-reset');
    },
    sendTxtMsg: function () {
        if (this.recipientId.length === 0) {
            return;
        } else {
            var $txtTag = $('textarea');
            if ($txtTag.length > 0) {
                var txt = new Message({
                    author: "Me",
                    recipient: recipientName,
                    number: recipientId,
                    content: $txtTag.val(),
                    timestamp: new Date().getTime()
                });
                console.log(txt);
                this.messageHistory.add(txt);
            }
        }
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
        getRecipient: function () {
            return recipientName;
        }
    }
});