import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/api";

const AppContext = createContext(undefined);

export function AppContextProvider({children}){


    // Auth states
    const [user, SetUSer] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true);

    // Auth Actions
    const checkSession = async ()=>{
        try{
            const{data} = await api.get("/api/auth/me");
            // setUSer(data.user);
        }catch (error){
            setUSer(null)
        }finally{
            setLoadingUser(false)
        }
    }

    useEffect(() => {
        checkSession()
    },[checkSession])

    return(
        <AppContext.Provider  value={{
            user, loadingUser
        }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(){
    const context = useContext(AppContext);
    if(context === undefined){
        throw new Error ("useAppContext must be used within an AppContextProvider");
    }
    return context;
}