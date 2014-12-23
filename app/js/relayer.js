var messagesSyncInterval = 60 * 1000; //ms
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
    contacts: '#contacts-area',
    compose: '#compose-area'
});
//load in templates, then begin the app
require(['text!/html/view/messageBoardCompositeView.html', 'text!/html/view/messageBoardItemView.html', 'text!/html/view/noMessagesItemView.html', 'text!/html/view/contactQueueCompositeView.html', 'text!/html/view/contactQueueItemView.html', 'text!/html/view/noContactsItemView.html', 'text!/html/view/composeItemView.html'], function (mbcvTemplate, mbivTemplate, nmivTemplate, cqcvTemplate, cqivTemplate, ncivTemplate, civTemplate) {
    App.start();
    var contacts = new Contacts();
    var cqcv = new ContactQueueCompositeView({
        html: cqcvTemplate,
        childViewHtml: cqivTemplate,
        childView: ContactQueueItemView,
        collection: contacts,
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
    App.contacts.show(cqcv);
    App.compose.show(civ);


    App.updateMessageBoardFilter = function (id, name) {
        mbcv.filter = id;
        mbcv.render();
    };
    App.vent.on('contact-select', App.updateMessageBoardFilter);

    messagesSyncThread = setInterval(function () {
        if (autoSync) {
            civ.syncWithServer();
        }
    }, messagesSyncInterval);
});
