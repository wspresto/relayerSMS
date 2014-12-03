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
require(['text!/html/view/messageBoardCompositeView.html'], function (mbcvTemplate) {
	App.start();

	var rlv = new RelayerLayoutView();
	App.relayer.show(rlv);
	rlv.messages.show(new MessageBoardCompositeView({template: mbcvTemplate}));
});
