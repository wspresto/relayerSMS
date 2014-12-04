var Relayer = Marionette.Application.extend({
   initialize: function () {
       console.log('Relayer online');
   }
});

var App = new  Relayer();

App.addRegions({
	relayer: 'body'
});

//load in templates, then begin the app
require(['text!/html/view/messageBoardCompositeView.html', 'text!/html/view/messageBoardItemView.html'], function (mbcvTemplate, mbivTemplate) {
	App.start();

	var rlv = new RelayerLayoutView();
	App.relayer.show(rlv);

    var messages = new Messages({url: 'http://192.168.1.4:8080'});
	rlv.messages.show(new MessageBoardCompositeView({
        template: mbcvTemplate,
        childTemplate: mbivTemplate,
        childModel: MessageBoardItemView,
        collection: messages
    }));
});
