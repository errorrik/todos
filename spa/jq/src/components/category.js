define(function () {
    function Category(option) {
        this.main = option.main;
        this.data = option.data;
    }

    Category.prototype.itemTpl = '{title}';

    Category.prototype.render = function () {
        var html = '';
        var tpl = '<li title="{title}" style="background:{color}" data-id="{id}">'
            + this.itemTpl
            + '</li>';

        this.data.forEach(function (item) {
            html += tpl.replace(
                /\{([a-z]+)\}/gi, 
                function (match, $1) {
                    return item[$1];
                }
            );
        });

        var me = this;
        $(this.main)
            .html(html)
            .delegate('li', 'click', function () {
                if (this.className === '') {
                    me.setSelected(this.getAttribute('data-id'));
                }
            });
    };

    Category.prototype.setData = function (data) {
        this.data = data;
        this.render();
        this.setSelected(this.selected);
    };

    Category.prototype.setSelected = function (id) {
        this.selected = id;

        var lis = this.main.getElementsByTagName('li');
        var len = lis.length;
        while (len--) {
            var li = lis[len];
            var itemId = li.getAttribute('data-id');

            li.className = (id && id == itemId) ? 'checked' : '';
        }
    };

    Category.prototype.getSelected = function () {
        return this.selected;
    };

    return Category;
});