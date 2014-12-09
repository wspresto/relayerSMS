var Message = Backbone.Model.extend({
    defaults: {
        author: '',
        recipient: 'Me',
        content: '',
        timestamp: '',
        number: ''
    },
    initialize: function () {

    }
});