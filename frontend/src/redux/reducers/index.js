import { combineReducers } from 'redux'
import imagesReducer from './imagesReducer'
import searchReducer from './searchReducer'
import screenWidthReducer from './screenWidthReducer'


export default combineReducers({
    imagesReducer,
    searchReducer,
    screenWidthReducer
})