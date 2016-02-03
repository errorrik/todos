define(function (require) {
    var UIModel = require('ef/UIModel');
    var service = require('../service');

    var DATE_TIMES = [
        {text: '12:00am', value: 0},
        {text: '1:00am', value: 1},
        {text: '2:00am', value: 2},
        {text: '3:00am', value: 3},
        {text: '4:00am', value: 4},
        {text: '5:00am', value: 5},
        {text: '6:00am', value: 6},
        {text: '7:00am', value: 7},
        {text: '8:00am', value: 8},
        {text: '9:00am', value: 9},
        {text: '10:00am', value: 10},
        {text: '11:00am', value: 11},
        {text: '12:00pm', value: 12},
        {text: '1:00pm', value: 13},
        {text: '2:00pm', value: 14},
        {text: '3:00pm', value: 15},
        {text: '4:00pm', value: 16},
        {text: '5:00pm', value: 17},
        {text: '6:00pm', value: 18},
        {text: '7:00pm', value: 19},
        {text: '8:00pm', value: 20},
        {text: '9:00pm', value: 21},
        {text: '10:00pm', value: 22},
        {text: '11:00pm', value: 23}
    ];

    function FormModel() {
        UIModel.apply(this, arguments);

        this.datasource = {
            todo: {
                retrieve: function (model) {
                    var id = model.get('id');
                    if (id) {
                        return service.todo(id);
                    }

                    var endTime = new Date();
                    endTime.setDate(endTime.getDate() + 1);
                    endTime.setSeconds(0);
                    endTime.setMinutes(0);
                    return Promise.resolve({
                        endTime: endTime.getTime()
                    });
                },
                dump: true
            },

            categories: function () {
                return service.categories();
            }
        };
    }
    require('er/util').inherits(FormModel, UIModel);

    FormModel.prototype.prepare = function () {
        this.set('dateTimes', DATE_TIMES);

        var endTime = new Date(this.get('endTime'));
        this.set('endTime', endTime);
        this.set('endTimeT', endTime.getHours());
    };

    FormModel.prototype.sendData = function (todo) {
        var id = this.get('id');
        if (id) {
            todo.id = id;
            return service.edit(todo);
        }

        return service.add(todo);
    };

    FormModel.prototype.refreshCategories = function () {
        return service.categories().then(this.set.bind(this, 'categories'));
    };

    return FormModel;
});
