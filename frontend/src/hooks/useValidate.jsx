import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import useHttp from "./useHttp";

export default function useValidate () {
    const http = useHttp();
    const navigate = useNavigate();
    const auth = useAuth();

    return () => {
        let promise;
        if (localStorage.getItem('token')) {
            promise = http('post', '/action/validate', {token: localStorage.getItem('token')}).then((response) => {
                auth.setName(response.data.account.name)
            }).catch(() => {
                auth.logout();
                navigate('/login');
            })
        } else {
            auth.logout();
            navigate('/login');
        }

        return promise || Promise.reject('No token')
    };
}