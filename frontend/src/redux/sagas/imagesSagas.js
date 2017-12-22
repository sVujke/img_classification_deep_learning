import { call, put, takeEvery, select } from 'redux-saga/effects';

import * as api from '../../api/imagesApi';
import {
    getImagesSuccess,
    getImagesFailure
} from '../actions/imagesActions';

import {
    GET_IMAGES_REQUEST
} from '../constants/imagesConstants';

import { fetchingSelector } from '../reducers/selectors'
export function* requestImages(action) {
    //const isFetching = yield select(fetchingSelector);
    try {
        const result = yield call(
            api.getImages,
            action.payload.query
        );
        if (result.ok) {
            
            yield put(getImagesSuccess());
        }
        else {
            yield put(getImagesFailure(result.status));
        }
    } catch (e) {
        yield put(getImagesFailure());
    }
}

export default function* root() {
    yield takeEvery(GET_IMAGES_REQUEST, requestImages);
}