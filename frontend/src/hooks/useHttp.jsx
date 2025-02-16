import axios from 'axios';
import APIEndpoint from '../API'

export function useHttp() {
    return (method, url, payload) => {
        if (!url) { return Promise.reject(new Error('No URL')) }

        let request;
        const headers = { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };

        if (method == 'post') {
            if (!payload) { return Promise.reject(new Error('No payload')) }

            request = axios.post(APIEndpoint + url, payload, { headers });
        } else if (method == 'get') {
            request = axios.get(APIEndpoint + url, { headers });
        } else {
            return Promise.reject(new Error('No method'));
        }

        return request.catch((reason) => {
            if (reason.response?.status === 401) { user.abandon() }

            return Promise.reject(reason);
        });
    }
}