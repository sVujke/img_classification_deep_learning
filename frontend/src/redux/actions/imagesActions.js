import { 
    SELECT_IMAGE, 
    DESELECT_IMAGE,
    GET_IMAGES_REQUEST,
    GET_IMAGES_SUCCESS,
    GET_IMAGES_FAILURE,
    POST_FEEDBACK_REQUEST,
    POST_FEEDBACK_SUCCESS,
    POST_FEEDBACK_FAILURE

} from '../constants/imagesConstants';


export function getImages(query) {
    return {
        type: GET_IMAGES_REQUEST,
        payload: {
            query
        }
    }
}
export function getImagesSuccess(images, step) {
    return {
        type: GET_IMAGES_SUCCESS,
        payload: {images, step}
    }
}
export function getImagesFailure() {
    return {
        type: GET_IMAGES_FAILURE
    }
}

export function selectImage() {

    return {
        type: SELECT_IMAGE
    }

}

export function deselectImage(index) {

    return {
        type: DESELECT_IMAGE,
        payload: index
    }

}

export function postFeedback(query) {

}