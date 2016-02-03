define(function (require) {
    require('er/tpl!./edit.tpl.html');
    require('esui/TextBox');
    require('../ui/ColorPicker');

    var UIView = require('ef/UIView');

    function EditView() {
        UIView.apply(this, arguments);
    }
    require('er/util').inherits(EditView, UIView);

    EditView.prototype.template = 'category/edit';

    EditView.prototype.enterDocument = function () {
        UIView.prototype.enterDocument.call(this);

        this.clickListener = clickListener.bind(this);
        this.getContainerElement().addEventListener('click', this.clickListener, false);
    };

    EditView.prototype.dispose = function () {
        if (this.clickListener) {
            this.getContainerElement().removeEventListener('click', this.clickListener, false);
            this.clickListener = null;
        }

        View.prototype.dispose.call(this);
    };

    EditView.prototype.rm = function (id) {
        var wrap = document.getElementById('edit-category-' + id);
        if (wrap) {
            this.get('title' + id).dispose();
            this.get('color' + id).dispose();
            wrap.parentNode.removeChild(wrap);
        }
    };

    function clickListener(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var cmd = target.getAttribute('data-cmd');
        if (cmd) {
            var id = target.parentNode.getAttribute('data-id');
            var title = this.get('title' + id).getValue();
            var color = this.get('color' + id).getValue();

            if (cmd === 'edit' && !title) {
                return;
            }

            this.fire(cmd, {
                id: id,
                title: title,
                color: color
            });
        }
    }

    return EditView;
});