import axios from "axios";
import { useAuth } from '../contexts/AuthContext';

const endpoint = 'http://192.168.2.116:80'; //IP HERE

export default function useHttp() {
    const auth = useAuth();

    return (method, url, payload = null) => {

        if (!url) { return Promise.reject(new Error('No URL')) }

        const token = localStorage.getItem('token') || null;

        let request;
        const headers = { 
            Authorization: `Bearer ${token}`,
        };

        if (method == 'post') {
            if (!payload) { return Promise.reject(new Error('No payload')) }

            request = axios.post(endpoint + url, payload, { headers });
        } else if (method == 'get') {
            request = axios.get(endpoint + url, { headers });
        } else {
            return Promise.reject(new Error('No '));
        }

        return request.catch((reason) => {
            if (reason.response?.status === 401) { auth.logout() }

            return Promise.reject(reason);
        });
    }
}