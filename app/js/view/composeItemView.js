var ComposeView = Backbone.Marionette.ItemView.extend({
    initialize: function (args) {
        this.template = _.template(args.html);
    },
    events: {
        'keypress textarea': 'submitMessage',
        'click #sync-btn': 'syncWithServer',
        'click #send-btn': 'sendTxtMsg',
        'click .key-btn': 'typeChar',
        'click #shift-btn': 'toggleCase',
        'click input[type=radio]': 'changeMessageSyncFrequency'
    },
    changeMessageSyncFrequency: function (e) {
        var $radioBtn = $(e.currentTarget);
        var seconds = parseInt($radioBtn.val());

        App.vent.trigger('messages-sync-frequency', seconds);
    },
    typeChar: function (e) {
        var $txtTag = $('textarea');
        var $btnPressed = $(e.currentTarget);


        var line = $txtTag.val();
        if ($btnPressed.hasClass('back-btn')) {
            line = line.substring(0,line.length - 1);            
        } else if ($btnPressed.hasClass('send-btn')) {
	    line = '';
	} else {
	    line +=  $btnPressed.text();
        }

        $txtTag.val(line);
    },
    toggleCase: function () {
        //TODO: toggle a flag and the button so that type char will use it to determine if char is upper or lower case
    },
    submitMessage: function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#send-btn').click();
        }
    },
    syncWithServer: function () {
        App.vent.trigger('messages-sync');
    },
    sendTxtMsg: function () {
        var $txtTag = $('textarea');
        if (recipientId.length > 0 && $txtTag.length > 0) {
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
                    App.vent.trigger('messages-sync');
                }
            }); //send the json payload to the servlet
            $('textarea').val('');
            $('textarea').text('');

        }

    }
});