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

    App.updateContactNotifications = function () {
        if (App.messages.length < 1) {
            return;
        }
        //update contact models with new contact notification values
        App.messages.comparator = function (model) { return model.get('author')};
        App.messages.sort();
        var count = 0;
        var id    = '';
        var contact = null;
        for(var m = 0; m + 1 < messages.length; m++) {
            count++;
            if (App.messages.at(m).get('author') !== messages.at(m + 1).get('author')) {
                id = App.messages.at(m).get('number');
                contact = contacts.findWhere({id: id});
                if (typeof contact !== 'undefined') {
                    contact.set('notifications', count);
                }
                count = 0;
            }
        }
        //in any case increase count by one
        count++;
        id = App.messages.at(App.messages.length - 1).get('number');
        contact = contacts.findWhere({id: id});
        if (typeof contact !== 'undefined') {
            contact.set('notifications', count);
        }
        App.vent.trigger('notification-reset');

        App.messages.comparator = function (model) { return model.get('timestamp')};
        App.messages.sort();
        App.vent.trigger('notifications-reset');
    };
    App.updateMessageBoardFilter = function (id, name) {
        mbcv.filter = id;
        mbcv.render();
    };
    App.vent.on('messages-reset', App.updateContactNotifications);
    App.vent.on('contact-select', App.updateMessageBoardFilter);

    messagesSyncThread = setInterval(function () {
        if (autoSync) {
            civ.syncWithServer();
        }
    }, messagesSyncInterval);
});
