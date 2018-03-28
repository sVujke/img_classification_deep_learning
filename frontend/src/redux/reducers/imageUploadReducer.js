import {
    SET_DISPLAY_IMAGE,
    UPLOAD_IMAGE_REQUEST,
    UPLOAD_IMAGE_SUCCESS,
    UPLOAD_IMAGE_FAILURE,
    PROMPT_IMAGE_UPLOAD
} from '../constants/imageUploadConstants';


const initialState = {
    base64image: null,
    uploading: false,
    prompted: false,
    error: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_DISPLAY_IMAGE: {
            return { ...state, base64image: action.payload.base64image, error: null};
        }
        case PROMPT_IMAGE_UPLOAD: {
            const prompted = action.payload.prompt
            return { ...state, base64image: null, prompted, error: null }
        }
        case UPLOAD_IMAGE_REQUEST: {
            return {...state, uploading: true, error: null}
        }
        case UPLOAD_IMAGE_SUCCESS: {
            return {...initialState}
        }
        case UPLOAD_IMAGE_FAILURE: {
            return {...state, uploading: false, error: action.payload.error}
        }
        default:
            return state;
    }
}