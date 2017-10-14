import { extractStore } from 'redux-defmap'

import todos from './actions/todos'
import visibilityFilter from './actions/visibilityFilter'

export default extractStore({
    todos,
    visibilityFilter
})
