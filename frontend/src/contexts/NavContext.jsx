import { Children, createContext, useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "./AuthContext";

const NavContext = createContext(null);

export function NavProvider({ children }){
    const [isActive, setIsActive] = useState(false);
    const [type, setType] = useState(0);
    const auth = useAuth();

    useEffect(() => {
        setType(auth.user?.authority || 0)
    }, [auth.user])

    const show = () => {
        setIsActive(true);
    }   
    
    const hide = () => {
        setIsActive(false);
    }

    return (
        <NavContext.Provider value={{isActive, show, hide}}>
            {children}
            <Navbar open={isActive} type={type}></Navbar>
        </NavContext.Provider>
    );
}

export function useNav(){
    return (useContext(NavContext))
}