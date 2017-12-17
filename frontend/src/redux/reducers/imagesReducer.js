import { SELECT_IMAGE, DESELECT_IMAGE } from '../constants/selectImagesConstants';

const initialState = {
    selectedImages: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SELECT_IMAGE:
            return { ...state, year: action.payload }

        case DESELECT_IMAGE:
            return { ...state, year: action.payload }

        default:
            return state;
    }
}