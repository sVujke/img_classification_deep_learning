import { SEARCH_TEXT_CHANGED, SEARCH_PRESSED } from '../constants/searchConstants'


const initialState = {
    activeSearch: null,
    currentSearchText: ''
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SEARCH_TEXT_CHANGED: {
            return { ...state, currentSearchText: action.payload.newText };
        }
        case SEARCH_PRESSED: {
            return { ...state, activeSearch: state.currentSearchText };
        }
        default:
            return state;
    }
}