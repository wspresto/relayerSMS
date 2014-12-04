var RelayerLayoutView = Backbone.Marionette.LayoutView.extend({
    template: 'body',
    regions: {
	    messages: '#message-area',
	    authors : '#author-area'
    },
    events: {
        'click #sync-btn': 'syncWithServer'
    },
    initialize: function () {
        console.log('Relayer layout view is alive.');
    },
    syncWithServer: function () {
        this.messages.currentView.collection.fetch();
    }
});