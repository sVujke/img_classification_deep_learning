import { SYNONYMS_UPDATE } from '../constants/synonymsConstants'


const initialState = {
    synonyms: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SYNONYMS_UPDATE: {
            return { ...state, synonyms: action.payload.synonyms};
        }
        default:
            return state;
    }
}