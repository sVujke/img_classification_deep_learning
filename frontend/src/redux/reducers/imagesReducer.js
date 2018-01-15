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
    step: null,
    fetching: false,
    posting: false,
    posted: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_IMAGES_REQUEST:
            return { ...state, fetching: true, images: null, step: null };

        case GET_IMAGES_SUCCESS:
            return { ...state, fetching: false, images: action.payload.images, step: action.payload.step };

        case GET_IMAGES_FAILURE:
            return { ...state, fetching: false, images: null, step: null };


        case SELECT_IMAGE: {
            var images = state.images;
            const { image } = action.payload;
            const i = images.indexOf(image);
            var photo = images[i];
            photo.selected = !photo.selected;
            return { ...state, images };
        }


        case POST_FEEDBACK_REQUEST:
            return { ...state, posting: true};

        case POST_FEEDBACK_SUCCESS:
            {
                const newState = initialState;
                return { ...newState, posted: true };
            }

        case POST_FEEDBACK_FAILURE:
            return { ...state, posting: false };

        default:
            return state;
    }
}