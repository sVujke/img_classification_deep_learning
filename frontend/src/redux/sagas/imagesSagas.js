import { call, put, takeEvery, select, wait } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import * as api from '../../api/imagesApi';
import {
    getImagesSuccess,
    getImagesFailure,
    postFeedbackFailure
} from '../actions/imagesActions';

import {
    synonymsUpdated
} from '../actions/synonymsActions';

import {
    GET_IMAGES_REQUEST, POST_FEEDBACK_REQUEST
} from '../constants/imagesConstants';

import { activeSearchSelector, stepSelector, imagesSelector } from '../reducers/selectors';
import { wrapImages, unwrapImages } from '../../utils/imageWrapper';

// For test
// export function* requestImages(action) {
//     var imagedata = [];
//     for (var i = 0; i < 20; i++) {
//         var str = i >= 10 ? '0000' : '00000';
//         imagedata.push(`http://localhost:3000/images/${str}${i}.jpg`)
//     }
//     yield call(delay, 1);
//     yield put(getImagesSuccess(wrapImages(imagedata), 2));
// }
// export function* postFeedback() {
//     yield put(postFeedbackSuccess());
// }
// End For test


export function* requestImages(action) {
    //needed so the photo gallery will disappear for 1 millisec
    //so that all the loaded images could reload again to trigger the update
    yield call(delay, 1);
    yield put(synonymsUpdated(null));
    try {
        const result = yield call(
            api.getImages,
            action.payload.query
        );
        if (result.status === 200) {
            yield put(getImagesSuccess(wrapImages(result.data.images), result.data.step));
            yield put(synonymsUpdated(result.data.synonyms))
        }
        else {
            yield put(getImagesFailure(result.error));
        }
    } catch (error) {
        yield put(getImagesFailure(error));
    }
}

export function* postFeedback() {

    const images = yield select(imagesSelector);
    const { selectedImages, nonSelectedImages } = unwrapImages(images);
    const data = {
        query: yield select(activeSearchSelector),
        step: yield select(stepSelector),
        selectedImages,
        nonSelectedImages
    }

    try {
        const result = yield call(
            api.postFeedback,
            data
        );
        if (result.status === 200) {
            yield put(getImagesSuccess(wrapImages(result.data.images), result.data.step));
        }
        else {
            yield put(postFeedbackFailure(result.error));
        }
    } catch (error) {
        yield put(postFeedbackFailure(error));
    }
}

export default function* root() {
    yield takeEvery(GET_IMAGES_REQUEST, requestImages);
    yield takeEvery(POST_FEEDBACK_REQUEST, postFeedback);
}