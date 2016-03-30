import React, {Component, PropTypes} from 'react'
import {History} from 'react-router'
import Reflux from 'reflux'
import {connector} from 'reflux-state-mixin'

import TimePicker from '../component/TimePicker'
import Calendar from '../component/Calendar'
import CategoryPicker from '../component/CategoryPicker'
import Layer from '../component/Layer'

import todoStore from './currentStore'
import todoActions from './actions'
import categoriesStore from '../category/store'
import categoriyActions from '../category/actions'

import AddCategoryPage from '../category/AddPage'
import EditCategoryPage from '../category/EditPage'


export default class FormPage extends Component {
    constructor(props) {
        super(props);

        this.titleChange = this.titleChange.bind(this);
        this.descChange = this.descChange.bind(this);
        this.okClicker = this.okClicker.bind(this);
        this.cancelClicker = this.cancelClicker.bind(this);
        this.addCategoryClicker = this.addCategoryClicker.bind(this);
        this.editCategoryClicker = this.editCategoryClicker.bind(this);
        this.finishAddCategory = this.finishAddCategory.bind(this);
        this.abortAddCategory = this.hideAddCategoryDialog.bind(this);
        this.finishEditCategory = this.hideEditCategoryDialog.bind(this);

        this.state = {
            todo: todoStore.getData(),
            categories: categoriesStore.getData()
        };
    }

    onStateChange(nextState) {
        this.setState(nextState);
    }

    componentWillMount() {
        this.unsubTodo = todoStore.listen(todo => {
            if (todo.requestCompleted) {
                this.finish();
                return;
            }
            this.onStateChange({todo});
        });
        this.unsubCategories = categoriesStore.listen(categories => {
            this.onStateChange({categories});
        });

        let id = this.props.params.id;
        if (id) {
            todoActions.item(+id);
        }

        categoriyActions.list();
    }

    componentWillUnmount() {
        this.unsubTodo();
        this.unsubCategories();
        this.destoryAddCategoryDialog();
        this.destoryEditCategoryDialog();
    }

    render() {
        const {
            todo: {
                title,
                desc,
                categoryId,
                endTimeDate,
                endTimeHour
            },
            categories
        } = this.state;

        return (
            <div className="form">
                <input type="text" className="form-title" placeholder="标题" value={title} onChange={this.titleChange} />
                <textarea className="form-desc" placeholder="备注" value={desc} onChange={this.descChange}></textarea>
                <CategoryPicker datasource={categories} initValue={categoryId} ref="category"></CategoryPicker>
                <i className="fa fa-plus add-category" onClick={this.addCategoryClicker}></i>
                <i className="fa fa-pencil edit-category" onClick={this.editCategoryClicker}></i>
                <div>预期完成时间： <Calendar initValue={endTimeDate} ref="endTimeDate"></Calendar><TimePicker initValue={endTimeHour} ref="endTimeHour"></TimePicker></div>
                <div className="form-op">
                    <button type="button" className="form-ok" onClick={this.okClicker}><i className="fa fa-check-circle-o"></i></button>
                    <button type="button" className="form-cancel" onClick={this.cancelClicker}><i className="fa fa-times-circle-o"></i></button>
                </div>
            </div>
        );
    }

    titleChange(e) {
        let todo = Object.assign({}, this.state.todo, {title: e.target.value});
        this.setState(Object.assign({}, this.state, {todo}));
    }

    descChange(e) {
        let todo = Object.assign({}, this.state.todo, {desc: e.target.value});
        this.setState(Object.assign({}, this.state, {todo}));
    }

    okClicker() {
        let todo = Object.assign(
            {}, 
            this.state.todo, 
            this.state,
            {
                categoryId: this.refs.category.state.value,
                endTimeHour: this.refs.endTimeHour.state.value,
                endTimeDate: this.refs.endTimeDate.state.value
            }
        );

        if (!todo.title) {
            return;
        }

        if (todo.id) {
            todoActions.edit(todo);
        }
        else {
            todoActions.add(todo);
        }
    }

    cancelClicker() {
        this.finish();
    }

    finish() {
        this.props.history.goBack();
    }

    addCategoryClicker() {
        this.initAddCategoryDialog();
        this.addCategoryDialog.pos({
            left: window.screen.availWidth / 2 - 100,
            top: 100
        });
    }

    initAddCategoryDialog() {
        if (this.addCategoryDialogInited) {
            return;
        }

        this.addCategoryDialog = new Layer({
            className: 'add-category-layer',
            left: -1000, 
            top: 100
        });
        this.addCategoryDialog.mount();

        let page = this.renderAddCategory();
        this.addCategoryDialog.render(page);

        this.addCategoryDialogInited = true;
    }

    renderAddCategory(props) {
        props = props || this.props;
        return (
            <AddCategoryPage 
                onFinish={this.finishAddCategory}
                onAbort={this.abortAddCategory}>
            </AddCategoryPage>
        );
    }

    finishAddCategory() {
        this.hideAddCategoryDialog();
    }

    abortAddCategory() {
        this.hideAddCategoryDialog();
    }

    hideAddCategoryDialog() {
        this.addCategoryDialog.pos({
            left: -1000,
            top: 100
        });
    }

    destoryAddCategoryDialog() {
        this.addCategoryDialog && this.addCategoryDialog.destory();
    }

    editCategoryClicker() {
        this.initEditCategoryDialog();
        this.editCategoryDialog.pos({
            left: window.screen.availWidth / 2 - 100,
            top: 100
        });
    }

    initEditCategoryDialog() {
        if (this.editCategoryDialogInited) {
            return;
        }

        this.editCategoryDialog = new Layer({
            className: 'edit-category-layer',
            left: -1000, 
            top: 100
        });
        this.editCategoryDialog.mount();

        let page = this.renderEditCategory();
        this.editCategoryDialog.render(page);

        this.editCategoryDialogInited = true;
    }

    renderEditCategory() {
        return (
            <div>
                <i className="fa fa-times-circle-o" onClick={this.finishEditCategory}></i>
                <EditCategoryPage></EditCategoryPage>
            </div>
        );
    }

    hideEditCategoryDialog() {
        this.editCategoryDialog.pos({
            left: -1000,
            top: 100
        });
    }

    destoryEditCategoryDialog() {
        this.editCategoryDialog && this.editCategoryDialog.destory();
    }
}


