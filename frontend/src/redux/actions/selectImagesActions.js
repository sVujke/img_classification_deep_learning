import { SELECT_IMAGE, DESELECT_IMAGE } from '../constants/selectImagesConstants';

export function selectImage(index) {

    return {
        type: SELECT_IMAGE,
        payload: index
    }

}

export function deselectImage(index) {

    return {
        type: DESELECT_IMAGE,
        payload: index
    }

}