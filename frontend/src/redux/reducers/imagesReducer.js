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
    fetching: false,
    posting: false,
    posted: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_IMAGES_REQUEST:
            return { ...initialState, fetching: true };

        case GET_IMAGES_SUCCESS:
            return { ...state, fetching: false, images: action.payload.images, step: action.payload.step };

        case GET_IMAGES_FAILURE:
            return { ...initialState };


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
            return { ...state, posting: true};

        case POST_FEEDBACK_SUCCESS:
            {
                return { ...initialState, posted: true };
            }

        case POST_FEEDBACK_FAILURE:
            return { ...state, posting: false };

        default:
            return state;
    }
}