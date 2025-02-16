import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp } from '../Hooks'

export function useAuthenticate() {
    const user = useUser();
    const http = useHttp();

    return () => {
        let promise;

        if (localStorage.getItem('token')) {
            promise = http('post', '/action/validate', {token: localStorage.getItem('token')}).then((response) => {
                user.use(response.data.account._id);
            }).catch(() => {
                user.abandon();
            })
        } else {
            user.abandon();
        }

        return promise || Promise.reject('No token');
    }
}