import { createContext, useContext, useEffect, useState } from "react";
import { useSidebar, useServerData, useMessage, useViewport, useHttp, useAuthenticate } from '../Hooks'
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState({});
    const [currentID, setCurrentID] = useState(null);

    const serverData = useServerData();
    const navigate = useNavigate();

    useEffect(() => {
        setUser(serverData.accounts.find(account => account._id == currentID));
    }, [serverData])

    const use = (accountID) => {
        setCurrentID(accountID);
        setUser(serverData.accounts.find(account => account._id == accountID) || {});
    }

    const abandon = () => {
        localStorage.removeItem('token');
        setCurrentID(null);
        setUser(null);

        navigate('login');
    }

    return (
        <UserContext.Provider value={{ use, abandon, current: user }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext);
}