// export const setVisibilityFilter = (filter) => ({
//   type: 'SET_VISIBILITY_FILTER',
//   filter
// })

export default {

    $state: 'SHOW_ALL',

    SET_VISIBILITY_FILTER: {
        setVisibilityFilter: (filter) => filter,
        $reduce: (state, filter) => filter
    }
}
