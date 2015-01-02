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
	this.listenTo(App.vent, 'messages-reset', this.render);
        this.listenTo(App.vent, 'contact-select', this.updateMessageRecepient);
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
    updateMessageRecepient: function (id, name) {
        recipientName = name;
        recipientId   = id;
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
    onRender: function () {
        var $msgBoard = $('#msg-board');
        if ($msgBoard.length > 0) {
            $msgBoard.scrollTop($msgBoard.get(0).scrollHeight);
        }

        //this.$el.scrollTop(this.$el.get(0).scrollHeight); doesnt work?!?!
    },
    templateHelpers: {
        getRecipient: function () {
            return recipientName;
        }
    }
});