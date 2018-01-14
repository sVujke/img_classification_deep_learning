import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import createSagaMiddleware from 'redux-saga'
import sagas from '../sagas'
import { createLogger } from 'redux-logger'

const sagaMiddleware = createSagaMiddleware();
const logger = createLogger();

export default createStore(
    rootReducer, 
    applyMiddleware(sagaMiddleware, logger)
) 

sagaMiddleware.run(sagas);

// if (module.hot) {
//     module.hot.accept('../reducers', () => {
//         const nextRootReducer = require('../reducers')
//         store.replaceReducer(nextRootReducer)
//     })
// }

