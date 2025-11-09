import { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMeService, loginService, logoutService, signupService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = (props) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        data: authUser,
        isLoading: loadingUser,
    } = useQuery({
        queryKey: ["authUser"],
        queryFn: getMeService,
        retry: false,
    });


    const {
        mutate: loginMutation,
        error: loginError,
    } = useMutation({
        mutationFn: (formData) => loginService(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        }
    });


    const {
        mutate: logoutMutation,
        error: logoutError,
    } = useMutation({
        mutationFn: logoutService,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["authUser"] });
        }
    });

    const {
        mutate: signupMutation,
        error: signupError,
    } = useMutation({
        mutationFn: (formData) => signupService(formData),
        onSuccess: () => {
            navigate('/login');
        }
    })

    return (
        <AuthContext.Provider
            value={{
                authUser,
                loadingUser,
                loginMutation,
                loginError,
                logoutMutation,
                logoutError,
                signupMutation,
                signupError,
            }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);