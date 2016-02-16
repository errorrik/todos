define(function (require) {
    var Backbone = require('Backbone');
    var moment = require('moment');

    return Backbone.Model.extend({
        initialize: function () {
            var endTime = this.get('endTime');
            if (!endTime) {
                var endTime = new Date();
                endTime.setDate(endTime.getDate() + 1);
                endTime.setSeconds(0);
                endTime.setMinutes(0);
            }
            else {
                endTime = new Date(this.get('endTime'));
            }
            this.set('endTime', endTime);
            this.set('endTime-time', endTime.getHours());
            this.set('endTimeText', moment(endTime).format('YYYY-MM-DD, h:mm a'));
        },
        
        validate: function (item) {
            var errors = [];

            if (!item.title) {
                errors.push({
                    name: 'title',
                    message: 'title is required!'
                });
            }

            return errors.length ? errors : false;
        }
    });
});