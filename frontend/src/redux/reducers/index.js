import { combineReducers } from 'redux'
import imagesReducer from './imagesReducer'
import searchReducer from './searchReducer'
import screenWidthReducer from './screenWidthReducer'
import synonymsReducer from './synonymsReducer'


export default combineReducers({
    imagesReducer,
    searchReducer,
    screenWidthReducer,
    synonymsReducer
})