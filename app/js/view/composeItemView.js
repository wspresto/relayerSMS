var ComposeView = Backbone.Marionette.ItemView.extend({
    initialize: function (args) {
        this.template = _.template(args.html);
    },
    events: {
        'click #send-btn': 'sendTxtMsg',
        'mousedown .key-btn': 'typeChar',
        'click #shift-btn': 'toggleCase',
        'click input[type=radio]': 'changeMessageSyncFrequency'

    },
    $txtTag: null,
    changeMessageSyncFrequency: function (e) {
        var $radioBtn = $(e.currentTarget);
        var seconds = parseInt($radioBtn.val());
        App.vent.trigger('messages-sync-frequency', seconds);
    },
    onShow: function () {
        this.$txtTag = $('textarea');
    },
    typeChar: function (e) {
        var $btnPressed = $(e.currentTarget);

        var line = this.$txtTag.val();
        if ($btnPressed.hasClass('back-btn')) {
            line = line.substring(0,line.length - 1);            
        } else if ($btnPressed.hasClass('send-btn')) {
            line = '';
        } else if ($btnPressed.hasClass('shift-btn')) {
            this.toggleCase();
        } else {
            line +=  $btnPressed.text();
        }

        this.$txtTag.val(line);
    },
    toggleCase: function () {
        //TODO: toggle a flag and the button so that type char will use it to determine if char is upper or lower case
    },
    sendTxtMsg: function () {
        if (recipientId.length > 0 && this.$txtTag.length > 0) {
            var txt = new Message({
                author: "Me",
                recipient: recipientName,
                number: recipientId,
                content: this.$txtTag.val(),
                timestamp: new Date().getTime()
            });
            //console.log(txt);
            txt.save({
                success: function () {
                    App.vent.trigger('messages-sync');
                }
            }); //send the json payload to the servlet
            this.$txtTag.val('');
            this.$txtTag.text('');

        }

    }
});