import { SCREEN_WIDTH_CHANGED } from '../constants/screenWidthConstants'


const initialState = {
    screenWidth: 0
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SCREEN_WIDTH_CHANGED: {
            return { ...state, screenWidth: action.payload.newWidth };
        }
        default:
            return state;
    }
}