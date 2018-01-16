import { 
    SELECT_IMAGE, 
    GET_IMAGES_REQUEST,
    GET_IMAGES_SUCCESS,
    GET_IMAGES_FAILURE,
    POST_FEEDBACK_REQUEST,
    POST_FEEDBACK_SUCCESS,
    POST_FEEDBACK_FAILURE,
    IMAGE_LOADED

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


export function selectImage(image) {
    return {
        type: SELECT_IMAGE,
        payload: {
            image
        }
    }
}
export function imageLoaded(image) {
    return {
        type: IMAGE_LOADED,
        payload: {
            image: image.photo,
            width: image.width,
            height: image.height
        }
    }
}

export function postFeedback() {
    return {
        type: POST_FEEDBACK_REQUEST
    }
}
export function postFeedbackSuccess() {
    return {
        type: POST_FEEDBACK_SUCCESS
    }
}
export function postFeedbackFailure() {
    return {
        type: POST_FEEDBACK_FAILURE
    }
}