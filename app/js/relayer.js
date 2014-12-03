var Relayer = Marionette.Application.extend({
   initialize: function () {
       console.log('Relayer online');
   }
});

var relayer = new Relayer();

relayer.addRegions({
    messages: '#message-area',
    controls: '#controls-area'
});

//load in templates, then begin the app
require(['text!/html/view/relayerLayoutView.html'], function (rlvTemplate) {
    relayer.messages.show(new RelayerLayoutView({template: rlvTemplate}));
    relayer.start();
});
