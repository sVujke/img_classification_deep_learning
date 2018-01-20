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

export function postFeedback (data) {
    const url = ApiURLs.host + ApiMethods.feedback;
    return axios.post(url, JSON.stringify(data), {
        headers:  {
            'Content-Type': 'application/json'
        }
    });
}