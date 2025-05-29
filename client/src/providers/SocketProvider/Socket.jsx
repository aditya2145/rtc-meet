import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
import {useAuth} from '../AuthProvider/AuthProvider'

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = (props) => {
    const { authUser } = useAuth();

    const socket = useMemo(() => {
        const URL = import.meta.env.NODE_ENV === "production"? undefined : import.meta.env.VITE_SOCKET_SERVER_URL;
        io(URL)
    }, []);

    return (
        <SocketContext.Provider value={{socket}}>
            {props.children}
        </SocketContext.Provider>
    )
}
