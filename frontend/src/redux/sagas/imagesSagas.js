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

import { activeSearchSelector, stepSelector, selectedImagesSelector, imagesSelector } from '../reducers/selectors';

export function* requestImages(action) {
    // try {
    //     const result = yield call(
    //         api.getImages,
    //         action.payload.query
    //     );
        var imagedata = [];
        for(var i = 0; i< 41; i++) { 
            var str = i >= 10 ? '0000' : '00000';
            imagedata.push(`${str}${i}.jpg`)
        }
        // if (result.ok) {
            yield put(getImagesSuccess(imagedata, 2));
    //     }
    //     else {
    //         yield put(getImagesFailure(result.status));
    //     }
    // } catch (e) {
    //     yield put(getImagesFailure());
    // }
}

export function* postFeedback() {

    // const selectedImages = yield select(selectedImagesSelector);
    // const images = yield select(imagesSelector);
    // var nonSelectedImages = images.filter(function (item) {
    //     return selectedImages.indexOf(item) === -1;
    // });
    // const data = {
    //     query: yield select(activeSearchSelector),
    //     step: yield select(stepSelector),
    //     selectedImages,
    //     nonSelectedImages
    // }

    // try {
    //     const result = yield call(
    //         api.postFeedback,
    //         data
    //     );
    //     if (result.ok) {
            yield put(postFeedbackSuccess());
    //     }
    //     else {
    //         yield put(postFeedbackFailure());
    //     }
    // } catch (e) {
    //     yield put(postFeedbackFailure());
    // }
}

export default function* root() {
    yield takeEvery(GET_IMAGES_REQUEST, requestImages);
    yield takeEvery(POST_FEEDBACK_REQUEST, postFeedback);
}