import { fork } from 'redux-saga/effects';
import imagesSagas from './imagesSagas';


export default function* root() {
    yield fork(imagesSagas);
}
