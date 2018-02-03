import { 
    SELECT_IMAGE,
    IMAGE_LOADED,
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
    loading: false,
    posted: false,
    error: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_IMAGES_REQUEST:
            return { ...initialState, loading: true };

        case GET_IMAGES_SUCCESS:
            return { ...state, loading: false, images: action.payload.images, step: action.payload.step, error: null };

        case GET_IMAGES_FAILURE:
            return { ...initialState, error: action.payload.error };


        case SELECT_IMAGE: {
            let { images } = state;
            let { image } = action.payload;
            let updatedImages = images.map((item, index) => {
                if (item.src === image.src) {
                    item.selected = !item.selected;
                }
                return item;
            })
            return {
                ...state, images: updatedImages
            }
        }

        case IMAGE_LOADED: {
            let { images } = state;
            let { image, width, height } = action.payload;
            let updatedImages = images.map((item, index) => {
                if (item.src === image.src) {
                    item.width = width;
                    item.height = height;
                }
                return item;
            })
            return {
                ...state, images: updatedImages
            }
        }


        case POST_FEEDBACK_REQUEST:
            return { ...state, loading: true, error: null};

        case POST_FEEDBACK_SUCCESS:
            {
                return { ...initialState, loading: false, posted: true };
            }

        case POST_FEEDBACK_FAILURE:
            return { ...initialState, error: action.payload.error };

        default:
            return state;
    }
}