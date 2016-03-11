import ActionType from './ActionType.js'
import * as service from '../service.js'

export function fetchCategories() {
    return (dispatch, getState) => {
        let state = getState();
        if (!state.categories.isFetching) {
            dispatch(innerFetchCategories());
        }
    };
}

function innerFetchCategories() {
    return dispatch => {
        dispatch(requestCategories());
        service.categories()
            .then(categories => {
                dispatch(receiveCategories(categories));
            });
    };
}

function requestCategories() {
    return {
        type: ActionType.REQUEST_CATEGORIES
    };
}

function receiveCategories(categories) {
    return {
        type: ActionType.RECEIVE_CATEGORIES,
        payload: {categories}
    };
}

export function startAddCategory() {
    return {
        type: ActionType.START_ADD_CATEGORY
    };
}

export function submitAddCategory(category) {
    return (dispatch, getState) => {
        let state = getState();

        if (state.addingCategory.isUpdating) {
            return;
        }

        dispatch({type: ActionType.UPADATING_ADD_CATEGORY});
        service.addCategory(category).then(() => {
            dispatch(submitAddCategoryFinished());
        });
    };
}

export function submitAddCategoryFinished() {
    return {type: ActionType.UPADATED_ADD_CATEGORY};
}

export function abortAddCategory() {
    return {type: ActionType.ABORT_ADD_CATEGORY};
}

export function submitEditCategory(category) {
    return dispatch => {
        dispatch({
            type: ActionType.UPDATING_EDIT_CATEGORY,
            payload: category
        });
        service.editCategory(category).then(() => {
            dispatch({
                type: ActionType.UPDATED_EDIT_CATEGORY,
                payload: category
            });
        });
    };
}

export function submitRmCategory(id) {
    return dispatch => {
        dispatch({
            type: ActionType.UPDATING_RM_CATEGORY,
            payload: id
        });
        service.rmCategory(id).then(() => {
            dispatch({
                type: ActionType.UPDATED_RM_CATEGORY,
                payload: id
            });
        });
    };
}

