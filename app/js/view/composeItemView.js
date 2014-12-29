var ComposeView = Backbone.Marionette.ItemView.extend({
    initialize: function (args) {
        this.template = _.template(args.html);
    },
    events: {
        'keypress textarea': 'submitMessage',
        'click #sync-btn': 'syncWithServer',
        'click #send-btn': 'sendTxtMsg',
        'click .key-btn': 'typeChar',
        'click #shift-btn': 'toUpperCase'
    },
    typeChar: function (e) {
        var $txtTag = $('textarea');
        var $btnPressed = $(e.currentTarget);


        var line = $txtTag.val();
        if (!$btnPressed.hasClass('back-btn')) {
            var charPressed = $btnPressed.text();
            line += charPressed;
        } else {
            line = line.substring(0,line.length - 1);
        }

        $txtTag.val(line);
    },
    toUpperCase: function () {

    },
    submitMessage: function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#send-btn').click();
        }
    },
    syncWithServer: function () {
        App.messages.fetch({reset: true, async : false}); //preserve all/old sms
        App.messages.trigger('reset');
        App.vent.trigger('messages-reset');
    },
    sendTxtMsg: function () {
        if (recipientId.length === 0) {
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
                //console.log(txt);
                txt.save({
                    success: function () {
                        console.log('message posted!');
                    }
                }); //send the json payload to the servlet
                $('textarea').val('');
                $('textarea').text('');
                App.messageHistory.add(txt);
            }
        }
    }
});