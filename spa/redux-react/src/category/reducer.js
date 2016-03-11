import ActionType from './ActionType.js'
import {colors} from '../config.js'

export default function categories(state = {list: []}, action) {
    switch (action.type) {
        case ActionType.REQUEST_CATEGORIES:
            return {
                isFetching: true,
                list: []
            };
        case ActionType.RECEIVE_CATEGORIES:
            return {
                isFetching: false,
                list: action.payload.categories
            };

        case ActionType.UPDATED_EDIT_CATEGORY:
            return {
                isFetching: state.isFetching,
                category: state.category,
                list: state.list.map(item => {
                    if (item.id === action.payload.id) {
                        return action.payload;
                    }

                    return item;
                })
            };

        case ActionType.UPDATED_RM_CATEGORY:
            let list = [];
            state.list.forEach(item => {
                if (item.id !== action.payload) {
                    list.push(item);
                }
            });

            return {
                isFetching: state.isFetching,
                category: state.category,
                list: list
            };
    }

    return state;
}

export function addingCategory(state, action) {
    switch (action.type) {
        case ActionType.START_ADD_CATEGORY:
            return {title: '', colors: colors};

        case ActionType.UPADATING_ADD_CATEGORY:
            return Object.assign({}, state, {isUpdating: true});

        case ActionType.UPADATED_ADD_CATEGORY:
            return Object.assign({}, state, {isUpdating: false, isUpdated: true});
    
        case ActionType.ABORT_ADD_CATEGORY:
            return Object.assign({}, state, {abort: true});
    }

    return {};
}