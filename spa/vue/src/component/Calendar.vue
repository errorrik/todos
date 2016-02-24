<template>
<div v-on:click="mainClick" class="ui-calendar">{{ value | formatDate 'YYYY-MM-DD' }}</div>
</template>


<script>
import Vue from 'vue'
import $ from "jquery"
import Layer from './Layer.vue'

export default {
    props: {
        value: {
            type: Date,
            required: true
        }
    },

    data() {
        return {
            left: -10000,
            top: -10000
        };
    },

    methods: {
        mainClick() {
            if (this.left >= 0) {
                this.hide();
            }
            else {
                this.show();
            }
        },

        hide: function () {
            this.left = -10000;
        },

        show: function () {
            let pos = $(this.$el).offset();
            this.left = pos.left;
            this.top = pos.top + this.$el.offsetHeight + 1;
        }
    },

    ready() {
        var now = new Date();
        let monthView = new Layer({
            parent: this,
            data: {
                value: now,
                viewYear: now.getFullYear(),
                viewMonth: now.getMonth(),
                left: this.left,
                top: this.top,
                dates: []
            },

            template: `
                <div class="ui-layer ui-calendar-layer" v-bind:style="{left: left + 'px', top: top + 'px'}">
                    <div class="ui-calendar-func">
                        <i class="fa fa-angle-left" v-on:click="prevMonth"></i>
                        <b>{{ viewYear }}-{{ viewMonth + 1 }}</b>
                        <i class="fa fa-angle-right" v-on:click="nextMonth"></i>
                    </div>
                    <ol class="date-head">
                        <li>一</li>
                        <li>二</li>
                        <li>三</li>
                        <li>四</li>
                        <li>五</li>
                        <li>六</li>
                        <li>日</li>
                    </ol>
                    <ol>
                        <li track-by="$index" v-for="item in dates" v-on:click="select(item)"
                            v-bind:class="{selected: item == value.getDate() && viewYear == value.getFullYear() && viewMonth == value.getMonth()}">{{item}}</li>
                    </ol>
                </div>
            `,

            methods: {
                select(date) {
                    if (date) {
                        this.value = new Date(this.viewYear, this.viewMonth, date);
                    }
                },

                prevMonth() {
                    this.viewMonth--;
                    this.calcViewProps();
                },

                nextMonth() {
                    this.viewMonth++;
                    this.calcViewProps();
                },

                calcViewProps() {
                    let dates = [];
                    let viewDate = new Date(this.viewYear, this.viewMonth, 1)
                    let day = viewDate.getDay() - 1;
                    for (; day % 7; day--) {
                        dates.push('');
                    }

                    this.viewYear = viewDate.getFullYear();
                    this.viewMonth = viewDate.getMonth();

                    let nextMonth = new Date(this.viewYear, this.viewMonth + 1, 1);
                    let days = (nextMonth - viewDate) / 24 / 60 / 60 / 1000;
                    for (let i = 1; i <= days; i++) {
                        dates.push(i);
                    }

                    this.dates = dates;
                }
            },

            watch: {
                value: v => {
                    this.value = v;
                }
            }
        });

        this.$watch('value', value => {
            monthView.year = monthView.viewYear = value.getFullYear();
            monthView.month = monthView.viewMonth = value.getMonth();
            monthView.date = value.getDate();
            monthView.calcViewProps();
        });

        this.$watch('left', value => {
            monthView.left = value;
        });

        this.$watch('top', value => {
            monthView.top = value;
        });

        monthView.$mount();

        this._docClicker = e => {
            let input = $(e.target).closest(monthView.$el);
            if (input.length === 0 && e.target != this.$el) {
                this.hide();
            }
        };

        $(document).on('click', this._docClicker);
    },

    beforeDestroy() {
        $(document).off('click', this._docClicker);
        this._docClicker = null;
    }
}
</script>


<style>
.ui-calendar {
    width: 100px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
}

.ui-calendar:hover {
    background: #444;
}

.ui-calendar-layer {
    width: 210px;
    background: #fff;
    color: #333;
}

.ui-calendar-layer .ui-calendar-func {
    line-height: 30px;
    height: 30px;
    background: #eee;
    color: #666;
}

.ui-calendar-layer ol {
    margin: 0;
    padding: 0;
}

.ui-calendar-layer b {
    text-align: center;
    width: 149px;
    float: left;
}

.ui-calendar-layer .fa-angle-left,
.ui-calendar-layer .fa-angle-right {
    cursor: pointer;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    float: left;
}

.ui-calendar-layer .fa-angle-right {
    float: right;
}

.ui-calendar-layer {
    overflow: hidden;
}

.ui-calendar-layer li {
    float: left;
    width: 30px;
    height: 20px;
    line-height: 20px;
    cursor: pointer;
    text-align: center;
    font-size: 12px;
}

.ui-calendar-layer .date-head li {
    background: #ddd;
    cursor: default;
}

.ui-calendar-layer li.selected {
    background: #eee;
    cursor: default;
}

</style>