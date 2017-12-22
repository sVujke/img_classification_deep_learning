import axios from 'axios'
import { ApiURLs } from '../config/apiURLs';

export function getImages(query) {
    
    const url = ApiURLs.host + '/get';
    return axios.get('url', query);   
}