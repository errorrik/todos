define(function (require) {
    var u = require('underscore');
    var lib = require('esui/lib');
    var Control = require('esui/Control');
    var paint = require('esui/painters');

    /**
     * 分类选取控件
     *
     * @extends Control
     * @constructor
     */
    function ColorPicker(options) {
        Control.apply(this, arguments);
    }

    ColorPicker.prototype = {
        /**
         * 控件类型，始终为`"ColorPicker"`
         *
         * @type {string}
         * @readonly
         * @override
         */
        type: 'ColorPicker',

        /**
         * 创建控件主元素，默认使用`ul`元素
         *
         * 如果需要使用其它类型作为主元素，
         * 需要在始终化时提供{@link Control#main}属性
         *
         * @return {HTMLElement}
         * @protected
         * @override
         */
        createMain: function () {
            return document.createElement('ul');
        },

        repaint: paint.createRepaint(
            Control.prototype.repaint,
            {
                name: ['datasource', 'value'],
                paint: function (control, value) {
                    var html = '';

                    for (var i = 0; i < value.length; i++) {
                        var item = value[i];
                        var classes = control.helper.getPartClasses('item');

                        if (item == control.value) {
                            classes.push.apply(classes, control.helper.getPartClasses('selected'));
                        }

                        html += lib.format('<li style="background:${color}" data-color="${color}"', {color: item});
                        html += ' class="' + classes.join(' ') + '">';
                        html += '</li>';
                    }

                    control.main.innerHTML = html;
                }
            }
        ),

        initEvents: function () {
            this.helper.addDOMEvent(this.main, 'click', u.bind(selectValue, this));
        },

        getValue: function () {
            return this.value;
        }
    };

    /**
     * 根据下拉弹层的`click`事件设置值
     *
     * @param {Event} e 触发事件的事件对象
     * @ignore
     */
    function selectValue(e) {
        var target = lib.event.getTarget(e);
        var color = target.getAttribute('data-color');
        if (color) {
            target = target.parentNode;
            this.set('value', color);
        }
    }

    lib.inherits(ColorPicker, Control);
    require('esui/main').register(ColorPicker);

    return ColorPicker;
});
