const initialState = {
    images: null,

}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SET_YEAR':
            return { ...state, year: action.payload }

        default:
            return state;
    }
}