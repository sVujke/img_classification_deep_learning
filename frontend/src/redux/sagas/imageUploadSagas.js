import { call, put, takeEvery, select } from 'redux-saga/effects';
import * as api from '../../api/imagesApi';
import {
    uploadImageSuccess,
    uploadImageFailure
} from '../actions/imageUploadActions';

import {
    UPLOAD_IMAGE_REQUEST
} from '../constants/imageUploadConstants';

import {
    getImagesSuccess
} from '../actions/imagesActions';

import {
    synonymsUpdated
} from '../actions/synonymsActions';

import { imageUploadSelector, activeSearchSelector } from '../reducers/selectors';
import { wrapImages } from '../../utils/imageWrapper';


export function* uploadImage(action) {
    const data = {
        base64image: yield select(imageUploadSelector),
        query: yield select(activeSearchSelector)
    }
    try {   
        const result = yield call(
            api.uploadBase64image,
            data
        );
        if (result.status === 200) {
            const {
                images,
                step,
                synonyms
            } = result.data
            yield put(uploadImageSuccess());
            yield put(getImagesSuccess(wrapImages(images), step));
            yield put(synonymsUpdated(synonyms))
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