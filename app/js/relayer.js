var messagesSyncInterval = 60 * 1000; //ms
var messagesSyncThread   = -1;
var Relayer = Backbone.Marionette.Application.extend({
   initialize: function () {
       console.log('Relayer online');
   }
});

var App = new  Relayer();
App.addRegions({
    messages: '#message-area',
    contacts: '#contacts-area'
});
//load in templates, then begin the app
require(['text!/html/view/messageBoardCompositeView.html', 'text!/html/view/messageBoardItemView.html', 'text!/html/view/noMessagesItemView.html', 'text!/html/view/contactQueueCompositeView.html', 'text!/html/view/contactQueueItemView.html', 'text!/html/view/noContactsItemView.html'], function (mbcvTemplate, mbivTemplate, nmivTemplate, cqcvTemplate, cqivTemplate, ncivTemplate) {
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

    var messages = new Messages();
    var oldMessages = new Messages();
    oldMessages.oldMessagesFetch();

    var mbcv = new MessageBoardCompositeView({
        html: mbcvTemplate,
        childViewHtml: mbivTemplate,
        childView: MessageBoardItemView,
        messages: messages,
        messageHistory: oldMessages,
        emptyView: NoMessages,
        emptyViewHtml: nmivTemplate
    });
    App.messages.show(mbcv);
    App.contacts.show(cqcv);

    App.updateContactNotifications = function () {
        if (messages.length < 1) {
            return;
        }
        //update contact models with new contact notification values
        messages.comparator = function (model) { return model.get('author')};
        messages.sort();
        var count = 0;
        var id    = '';
        var contact = null;
        for(var m = 0; m + 1 < messages.length; m++) {
            count++;
            if (messages.at(m).get('author') !== messages.at(m + 1).get('author')) {
                id = messages.at(m).get('number');
                contact = contacts.findWhere({id: id});
                if (contact !== null) {
                    contact.set('notifications', count);
                }
                count = 0;
            }
        }
        //in any case increase count by one
        count++;
        id = messages.at(messages.length - 1).get('number');
        contact = contacts.findWhere({id: id});
        if (contact !== null) {
            contact.set('notifications', count);
        }
        App.vent.trigger('notification-reset');

        messages.comparator = function (model) { return model.get('timestamp')};
        messages.sort();
        App.vent.trigger('notifications-reset');
    };
    App.updateMessageBoardFilter = function (id, name) {
        mbcv.filter = id;
        mbcv.render();
    };
    App.vent.on('messages-reset', App.updateContactNotifications);
    App.vent.on('contact-select', App.updateMessageBoardFilter);

    messagesSyncThread = setInterval(function () {
        mbcv.syncWithServer();
    }, messagesSyncInterval);
});
