let nextTodoId = 0

export default {

    $state: [],

    ADD_TODO: {
        addTodo: (text) => ({
            id: nextTodoId++,
            text
        }),
        $reduce: (state, payload) => ([
            ...state,
            {
                id: payload.id,
                text: payload.text,
                completed: false
            }
        ])
    },
    TOGGLE_TODO: {
        toggleTodo: (id) => ({
            id
        }),
        $reduce: (state, payload) => state.map(todo =>
            (todo.id === payload.id) ? { ...todo, completed: !todo.completed } : todo
        )
    }
}
