import { SEARCH_TEXT_CHANGED, SEARCH_PRESSED } from '../constants/searchConstants'


export function searchTextChanged(newText) {
    return {
        type: SEARCH_TEXT_CHANGED,
        payload: {
            newText
        }
    }
}
export function searchPressed() {
    return {
        type: SEARCH_PRESSED
    }
}