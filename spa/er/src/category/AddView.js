define(function (require) {
    require('er/tpl!./add.tpl.html');
    require('esui/TextBox');
    require('../ui/ColorPicker');

    var UIView = require('ef/UIView');

    function AddView() {
        UIView.apply(this, arguments);
    }
    require('er/util').inherits(AddView, UIView);

    AddView.prototype.template = 'category/add';

    AddView.prototype.uiProperties = {
        color: {
            datasource: '@colors'
        }
    };

    AddView.prototype.uiEvents = {
        cancel: {
            click: function () {
                this.fire('cancel');
            }
        },

        ok: {
            click: function () {
                var title = this.get('title').getValue();
                if (title) {
                    this.fire('submit', {
                        title: title,
                        color: this.get('color').getValue()
                    });
                }
            }
        }
    };

    return AddView;
});