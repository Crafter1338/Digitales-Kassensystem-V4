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

    return (
        <NavContext.Provider>
            {Children}
            <Navbar isActive={{isActive}}></Navbar>
        </NavContext.Provider>
    );
}

export function useNav(){
    return (useContext(NavContext))
}