var RelayerLayoutView = Backbone.Marionette.LayoutView.extend({
    template: 'body',
    regions: {
	    messages: '#message-area',
	    authors : '#author-area'
    },
    initialize: function () {
        console.log('Relayer layout view is alive.');
    }
});