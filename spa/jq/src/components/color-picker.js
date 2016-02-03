define(function () {
    var DEFAULT_COLORS = [
        '#c23531', '#314656', '#dd8668', '#91c7ae', 
        '#6e7074', '#bda29a', '#44525d', '#c4ccd3'
    ];

    function ColorPicker(option) {
        this.main = option.main;
        this.colors = option.colors || DEFAULT_COLORS;
    }

    ColorPicker.prototype.itemTpl = '{title}';

    ColorPicker.prototype.render = function () {
        var html = '';
        var tpl = '<li style="background:{color}" data-color="{color}"></li>';

        this.colors.forEach(function (item) {
            html += tpl.replace(
                /\{color\}/g, 
                function (match) {
                    return item;
                }
            );
        });

        var me = this;
        $(this.main)
            .addClass('color-picker')
            .html(html)
            .delegate('li', 'click', function () {
                me.setSelected(this.getAttribute('data-color'));
            });
    };

    ColorPicker.prototype.setSelected = function (color) {
        this.selected = color;

        var lis = this.main.getElementsByTagName('li');
        var len = lis.length;
        while (len--) {
            var li = lis[len];
            var itemColor = li.getAttribute('data-color');

            li.className = color === itemColor ? 'checked' : '';
        }
    };

    ColorPicker.prototype.getSelected = function () {
        return this.selected;
    };

    ColorPicker.prototype.dispose = function () {
        this.main = null;
    };

    return ColorPicker;
});