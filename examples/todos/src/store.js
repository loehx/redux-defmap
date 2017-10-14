import { extractStore } from 'redux-jedi'

import todos from './actions/todos'
import visibilityFilter from './actions/visibilityFilter'

export default extractStore({
    todos,
    visibilityFilter
})
