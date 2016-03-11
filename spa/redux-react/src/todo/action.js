import * as service from '../service.js'
import ActionType from './ActionType.js'

function innerFetchTodos(category) {
    return dispatch => {
        dispatch(requestTodos(category));
        return service.todos(category)
            .then(todos => dispatch(receiveTodos(category, todos)))
    };
}

function requestTodos(category) {
    return {
        type: ActionType.REQUEST_TODOS,
        payload: {
            category
        }
    };
}

function receiveTodos(category, todos) {
    return {
        type: ActionType.RECEIVE_TODOS,
        payload: {
            category,
            todos
        }
    };
}

export function fetchTodos(category) {
    return (dispatch, getState) => {
        let state = getState();

        if (!state.todos.isFetching) {
            return dispatch(innerFetchTodos(category));
        }
    };
}


export function doneTodo(id) {
    return (dispatch, getState) => {
        let state = getState();
        let notDone = true;
        state.todos.list.forEach(item => {
            if (item.id === id) {
                notDone = !item.done;
            }
        });

        if (notDone) {
            service.done(id);
            dispatch({
                type: ActionType.DONE_TODO,
                payload: id
            });
        }
    };
}

export function rmTodo(id) {
    service.rm(id);
    return {
        type: ActionType.RM_TODO,
        payload: id
    };
}

export function startAddTodo() {
    let now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);

    return {
        type: ActionType.START_ADD_TODO,
        payload: cutTodoEndTime({
            title: '',
            desc: '',
            endTime: now.getTime(),
            categoryId: null,
            done: false
        })
    };
}

export function startEditTodo(id) {
    return dispatch => {
        dispatch({
            type: ActionType.REQUEST_TODO
        });

        service.todo(id).then(todo => {
            dispatch({
                type: ActionType.RECEIVE_TODO,
                payload: cutTodoEndTime(todo)
            })
        })
    };
}

export function submitAddTodo(todo) {
    return (dispatch, getState) => {
        let state = getState();
        if (state.editingTodo.isUpdating) {
            return;
        }

        dispatch({type: ActionType.UPDATING_TODO});
        todo = combineTodoEndTime(todo);
        console.log(todo)
        service.add(todo).then(() => {
            dispatch({type: ActionType.UPDATED_TODO});
        });
    };
}

export function submitEditTodo(todo) {
    return (dispatch, getState) => {
        let state = getState();
        if (state.editingTodo.isUpdating) {
            return;
        }

        dispatch({type: ActionType.UPDATING_TODO});
        todo = combineTodoEndTime(todo);
        service.edit(todo).then(() => {
            dispatch({type: ActionType.UPDATED_TODO});
        });
    };
}

function cutTodoEndTime(todo) {
    if (todo.isFetching) {
        return todo;
    }

    let endTimeDate = new Date(todo.endTime);
    let endTimeHour = endTimeDate.getHours();
    endTimeDate.setHours(0);
    endTimeDate.setMinutes(0);
    endTimeDate.setSeconds(0);

    return Object.assign({}, todo, {
        endTimeDate,
        endTimeHour
    });
}

function combineTodoEndTime(todo) {
    let endTime = new Date(todo.endTimeDate.getTime());
    endTime.setHours(todo.endTimeHour);
    return Object.assign({}, todo, {endTime: endTime.getTime()});
}

export function endEditTodo() {
    return {
        type: ActionType.END_EDIT_TODO
    };
}
