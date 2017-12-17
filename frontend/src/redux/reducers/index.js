import { combineReducers } from 'redux'
import apiRequestsReducer from './apiRequestsReducer'
import imagesReducer from './imagesReducer'

export default combineReducers({
    apiRequestsReducer,
    imagesReducer
})