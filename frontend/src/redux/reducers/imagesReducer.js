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

const initialState = {
    images: null,
    selectedImages: null,
    step: null,
    fetching: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_IMAGES_REQUEST:
            return { ...state, fetching: true };

        case GET_IMAGES_SUCCESS:
            return { ...state, fetching: false, images: action.payload.images, step: action.payload.step };

        case GET_IMAGES_FAILURE:
            return { ...state, fetching: false, images: null, step: null };


        case SELECT_IMAGE:
            return state;

        case DESELECT_IMAGE:
            return state;


        case POST_FEEDBACK_REQUEST:
            return state;

        case POST_FEEDBACK_SUCCESS:
            return state;

        case POST_FEEDBACK_FAILURE:
            return state;

        default:
            return state;
    }
}