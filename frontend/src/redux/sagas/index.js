import { fork } from 'redux-saga/effects';
import imagesSagas from './imagesSagas';
import imageUploadSagas from './imageUploadSagas';


export default function* root() {
    yield fork(imagesSagas);
    yield fork(imageUploadSagas);
}
