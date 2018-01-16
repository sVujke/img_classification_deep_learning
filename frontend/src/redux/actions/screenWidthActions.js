import { SCREEN_WIDTH_CHANGED } from '../constants/screenWidthConstants'


export function screenWidthChanged(newWidth) {
    return {
        type: SCREEN_WIDTH_CHANGED,
        payload: {
            newWidth
        }
    }
}