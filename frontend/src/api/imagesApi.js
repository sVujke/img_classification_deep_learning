import axios from 'axios';
import { ApiURLs, ApiMethods } from '../config/apiURLs';

export function getImages(query) {
    
    const url = ApiURLs.host + ApiMethods.search;
    return axios.get(url, 
        {
            params: {
                query
            }
        }
    );   
}

export function postFeedback (query) {
    const url = ApiURLs.host + ApiMethods.feedback;
    var data = { lol: 123}
    return axios.post(url, data);
}