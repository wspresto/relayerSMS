var messagesSyncInterval = 30 * 1000; //ms
var messagesSyncThread   = -1;
var autoSync = true;
var Relayer = Backbone.Marionette.Application.extend({
   initialize: function () {
       console.log('Relayer online');
   }
});

var App = new  Relayer();
App.addRegions({
    txts: '#message-area',
    authors: '#contacts-area',
    compose: '#compose-area'
});
//load in templates, then begin the app
require(['text!/html/view/messageBoardCompositeView.html', 'text!/html/view/messageBoardItemView.html', 'text!/html/view/noMessagesItemView.html', 'text!/html/view/contactQueueCompositeView.html', 'text!/html/view/contactQueueItemView.html', 'text!/html/view/noContactsItemView.html', 'text!/html/view/composeItemView.html'], function (mbcvTemplate, mbivTemplate, nmivTemplate, cqcvTemplate, cqivTemplate, ncivTemplate, civTemplate) {
    App.start();
    App.contacts = new Contacts();
    var cqcv = new ContactQueueCompositeView({
        html: cqcvTemplate,
        childViewHtml: cqivTemplate,
        childView: ContactQueueItemView,
        collection: App.contacts,
        emptyView: NoContacts,
        emptyViewHtml: ncivTemplate
    });
    cqcv.syncWithServer();

    App.messages = new Messages();
    App.messages.fetch({reset: true});
    App.messageHistory = new OldMessages();
    App.messageHistory.fetch({async: true, reset: true}); //SLOW


    var mbcv = new MessageBoardCompositeView({
        html: mbcvTemplate,
        childViewHtml: mbivTemplate,
        childView: MessageBoardItemView,
        messages: App.messages,
        messageHistory: App.messageHistory,
        emptyView: NoMessages,
        emptyViewHtml: nmivTemplate
    });
    var civ = new ComposeView({
        html: civTemplate
    });

    App.txts.show(mbcv);
    App.authors.show(cqcv);
    App.compose.show(civ);



    messagesSyncThread = setInterval(function () {
        if (autoSync) {
            App.vent.trigger('messages-sync');
        }
    }, messagesSyncInterval);

    App.updateContactNotifications = function () {
        if (App.messages.length < 1) {
            return;
        }
        //update contact models with new contact notification values
        //DONE: trigger a reset notifications event for all listening contact views
        var id    = '';
        var isUnRead = '';
        for(var m = 0; m < App.messages.length; m++) {
            id = App.messages.at(m).get('number');
            isUnRead = App.messages.at(m).get('isUnRead');
            //DONE: for all messages marked as unread trigger a new-message with an argument of author id, thenn listening contact models can increase their notifications
            if (isUnRead === 'true') {
                //console.log('new message arrived:' + App.messages.at(m).get('number')); //TESTING!!!
                App.vent.trigger('message-new', id);
            }
        }

        App.messages.comparator = function (model) { return model.get('timestamp')};
        App.messages.sort();
        App.vent.trigger('contact-sort'); //force render of contact queue
    };

    //Global Events

    App.listenTo(App.messages, 'reset', _.bind(mbcv.render, mbcv));
    App.listenTo(App.messageHistory, 'reset', _.bind(mbcv.render, mbcv)); //do not trigger notifications for old messages
    App.listenTo(App.messages, 'reset', App.updateContactNotifications);

    //App.listenTo(App.vent, 'contact-select', App.updateMessageBoardFilter);
    App.listenTo(App.vent, 'contact-select',   _.bind(mbcv.updateMessageRecepient, mbcv));
    App.listenTo(App.vent, 'contact-select',   _.bind(cqcv.updateSelectedContact, cqcv));
    App.listenTo(App.vent, 'refresh-messages', _.bind(mbcv.render, mbcv));
    App.listenTo(App.vent, 'contact-sort',     _.bind(cqcv.sortByNotifications, cqcv));

    App.listenTo(App.vent, 'messages-sync', function () {
        App.messages.fetch({reset: true, async : true}); //preserve all/old sms
    });


});
