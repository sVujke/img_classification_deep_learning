import { 
    SELECT_IMAGE,
    GET_IMAGES_REQUEST,
    GET_IMAGES_SUCCESS,
    GET_IMAGES_FAILURE,
    POST_FEEDBACK_REQUEST,
    POST_FEEDBACK_SUCCESS,
    POST_FEEDBACK_FAILURE
} from '../constants/imagesConstants';

const initialState = {
    images: null,
    selectedImages: [],
    step: null,
    fetching: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_IMAGES_REQUEST:
            return { ...state, fetching: true, images: null, step: null, selectedImages: null };

        case GET_IMAGES_SUCCESS:
            return { ...state, fetching: false, images: action.payload.images, step: action.payload.step, selectedImages: [] };

        case GET_IMAGES_FAILURE:
            return { ...state, fetching: false, images: null, step: null, selectedImages: null };


        case SELECT_IMAGE: {
            var selectedImages = state.selectedImages;
            const { name } = action.payload;
            const i = selectedImages.indexOf(name);
            i === -1 ? selectedImages.push(name) : selectedImages.splice(i, 1);
            return { ...state, selectedImages: selectedImages };
        }


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