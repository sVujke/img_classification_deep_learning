import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import createSagaMiddleware from 'redux-saga'
import sagas from '../sagas'

export default function configureStore(initialState) {

    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware))
    sagaMiddleware.run(sagas);

    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers')
            store.replaceReducer(nextRootReducer)
        })
    }

    return store
}