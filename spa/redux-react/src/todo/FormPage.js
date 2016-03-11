import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import TimePicker from '../component/TimePicker.js'
import Calendar from '../component/Calendar.js'
import CategoryPicker from '../component/CategoryPicker.js'
import {startAddTodo, startEditTodo, submitAddTodo, submitEditTodo, endEditTodo} from './action.js'
import {fetchCategories} from '../category/action.js'
import Layer from '../component/Layer.js'
import {AddPage as AddCategoryPage} from '../category/AddPage.js'
import {EditPage as EditCategoryPage} from '../category/EditPage.js'

class FormPage extends Component {
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
            title: '',
            desc: ''
        };
    }

    componentWillMount() {
        let {dispatch, params: {id}} = this.props;
        if (id) {
            dispatch(startEditTodo(id));
        }
        else {
            dispatch(startAddTodo());
        }

        dispatch(fetchCategories());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.current.isUpdated) {
            this.finish();
            return;
        }

        this.setState({
            title: nextProps.current.title,
            desc: nextProps.current.desc
        });
    }

    componentWillUnmount() {
        this.destoryAddCategoryDialog();
        this.destoryEditCategoryDialog();
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.addCategoryDialog) {
            this.addCategoryDialog.render(this.renderAddCategory(nextProps));
        }

        if (this.editCategoryDialog) {
            this.editCategoryDialog.render(this.renderEditCategory(nextProps));
        }
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
                dispatch={props.dispatch} 
                current={props.addingCategory}
                onFinish={this.finishAddCategory}
                onAbort={this.abortAddCategory}>
            </AddCategoryPage>
        );
    }

    finishAddCategory() {
        this.props.dispatch(fetchCategories());
        this.hideAddCategoryDialog();
    }

    hideAddCategoryDialog() {
        this.addCategoryDialog.pos({
            left: -1000,
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

    renderEditCategory(props) {
        props = props || this.props;
        return (
            <div>
                <i className="fa fa-times-circle-o" onClick={this.finishEditCategory}></i>
                <EditCategoryPage 
                    dispatch={props.dispatch} 
                    categories={props.categories}>
                </EditCategoryPage>
            </div>
        );
    }

    hideEditCategoryDialog() {
        this.editCategoryDialog.pos({
            left: -1000,
            top: 100
        });
    }

    destoryAddCategoryDialog() {
        this.addCategoryDialog && this.addCategoryDialog.destory();
    }

    destoryEditCategoryDialog() {
        this.editCategoryDialog && this.editCategoryDialog.destory();
    }

    render() {
        const {
            current: {
                categoryId,
                endTimeHour,
                endTimeDate
            },
            categories: {
                list: categoriesData
            }
        } = this.props;

        return (
            <div className="form">
                <input type="text" className="form-title" placeholder="标题" value={this.state.title} onChange={this.titleChange} />
                <textarea className="form-desc" placeholder="备注" value={this.state.desc} onChange={this.descChange}></textarea>
                <CategoryPicker datasource={categoriesData} initValue={categoryId} ref="category"></CategoryPicker>
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
        this.setState(Object.assign({}, this.state, {title: e.target.value}));
    }

    descChange(e) {
        this.setState(Object.assign({}, this.state, {desc: e.target.value}));
    }

    okClicker() {
        let todo = Object.assign(
            {}, 
            this.props.current, 
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

        let submitAction = submitAddTodo;
        if (todo.id) {
            submitAction = submitEditTodo;
        }

        this.props.dispatch(submitAction(todo));
    }

    cancelClicker() {
        this.finish();
    }

    addCategoryClicker() {
        this.initAddCategoryDialog();
        this.addCategoryDialog.pos({
            left: window.screen.availWidth / 2 - 100,
            top: 100
        });
    }

    editCategoryClicker() {
        this.initEditCategoryDialog();
        this.editCategoryDialog.pos({
            left: window.screen.availWidth / 2 - 100,
            top: 100
        });
    }

    finish() {
        this.props.dispatch(endEditTodo());
        this.props.history.goBack();
    }
}

FormPage.propTypes = {
    current: PropTypes.object,
    categories: PropTypes.object
};

export default connect(function (state) {
    return {
        current: state.editingTodo,
        categories: state.categories,
        addingCategory: state.addingCategory
    };
})(FormPage)

