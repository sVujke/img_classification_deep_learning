import { call, put, takeEvery, select } from 'redux-saga/effects';

import * as api from '../../api/imagesApi';
import {
    getImagesSuccess,
    getImagesFailure,
    postFeedbackSuccess,
    postFeedbackFailure
} from '../actions/imagesActions';
import {
    GET_IMAGES_REQUEST, POST_FEEDBACK_REQUEST
} from '../constants/imagesConstants';

import { activeSearchSelector, stepSelector, imagesSelector } from '../reducers/selectors';
import { wrapImages, unwrapImages } from '../../utils/imageWrapper';

// For test
export function* requestImages(action) {
    var imagedata = [];
    for (var i = 0; i < 41; i++) {
        var str = i >= 10 ? '0000' : '00000';
        imagedata.push(`http://localhost:3000/mlimages/${str}${i}.jpg`)
    }
    yield put(getImagesSuccess(wrapImages(imagedata), 2));
}
export function* postFeedback() {
    yield put(postFeedbackSuccess());
}
// End For test


// export function* requestImages(action) {
//     try {
//         const result = yield call(
//             api.getImages,
//             action.payload.query
//         );
//         if (result.ok) {
//             yield put(getImagesSuccess(wrapImages(result.images), result.step));
//         }
//         else {
//             yield put(getImagesFailure(result.status));
//         }
//     } catch (e) {
//         yield put(getImagesFailure());
//     }
// }

// export function* postFeedback() {

//     const images = yield select(imagesSelector);
//     const { selectedImages, nonSelectedImages } = unwrapImages(images);
//     const data = {
//         query: yield select(activeSearchSelector),
//         step: yield select(stepSelector),
//         selectedImages,
//         nonSelectedImages
//     }

//     try {
//         const result = yield call(
//             api.postFeedback,
//             data
//         );
//         if (result.ok) {
//             yield put(postFeedbackSuccess());
//         }
//         else {
//             yield put(postFeedbackFailure());
//         }
//     } catch (e) {
//         yield put(postFeedbackFailure());
//     }
// }

export default function* root() {
    yield takeEvery(GET_IMAGES_REQUEST, requestImages);
    yield takeEvery(POST_FEEDBACK_REQUEST, postFeedback);
}