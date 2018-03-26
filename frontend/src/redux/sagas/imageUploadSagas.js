import { call, put, takeEvery, select } from 'redux-saga/effects';
import * as api from '../../api/imagesApi';
import {
    uploadImageSuccess,
    uploadImageFailure
} from '../actions/imageUploadActions';

import {
    UPLOAD_IMAGE_REQUEST
} from '../constants/imageUploadConstants';

import { imageUploadSelector } from '../reducers/selectors';


export function* uploadImage(action) {
    const data = {
        base64image: yield select(imageUploadSelector),
    }
    try {   
        const result = yield call(
            api.uploadBase64image,
            data
        );
        if (result.status === 200) {
            yield put(uploadImageSuccess());
        }
        else {
            yield put(uploadImageFailure(result.error));
        }
    } catch (error) {
        yield put(uploadImageFailure(error));
    }
}

export default function* root() {
    yield takeEvery(UPLOAD_IMAGE_REQUEST, uploadImage);
}