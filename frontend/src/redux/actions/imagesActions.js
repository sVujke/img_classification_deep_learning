import { 
    SELECT_IMAGE, 
    GET_IMAGES_REQUEST,
    GET_IMAGES_SUCCESS,
    GET_IMAGES_FAILURE,
    POST_FEEDBACK_REQUEST,
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
export function getImagesFailure(error) {
    return {
        type: GET_IMAGES_FAILURE,
        payload: { error }
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
export function postFeedbackFailure(error) {
    return {
        type: POST_FEEDBACK_FAILURE,
        payload: { error }
    }
}