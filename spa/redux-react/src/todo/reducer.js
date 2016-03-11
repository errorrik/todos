
import ActionType from './ActionType.js'

export default function todos(state = {list: []}, action) {
    switch (action.type) {
        case ActionType.REQUEST_TODOS:
            return {
                isFetching: true,
                category: action.payload.category,
                list: []
            };

        case ActionType.RECEIVE_TODOS:
            return {
                isFetching: false,
                category: action.payload.category,
                list: action.payload.todos
            };

        case ActionType.DONE_TODO:
            return {
                isFetching: state.isFetching,
                category: state.category,
                list: state.list.map(item => {
                    if (item.id === action.payload) {
                        let tar = Object.assign({}, item);
                        tar.done = true;
                        return tar;
                    }
                    return item;
                })
            };


        case ActionType.RM_TODO:
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

export function editingTodo(state = {}, action) {
    switch (action.type) {
        case ActionType.START_ADD_TODO:
        case ActionType.RECEIVE_TODO:
            return action.payload;
            
        case ActionType.REQUEST_TODO:
            return {
                isFetching: true
            };

        case ActionType.UPDATING_TODO:
            return Object.assign({}, state, {isUpdating: true});

        case ActionType.UPDATED_TODO:
            return Object.assign({}, state, {isUpdating: false, isUpdated: true});

        case ActionType.END_EDIT_TODO:
            return {};
    }

    return state;
}


