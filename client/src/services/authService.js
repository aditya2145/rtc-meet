import { handleApiResponse } from "../../utils/handlerApiResponse";

export const getMeService = async () => {
    const res = await fetch('/api/users/me', {
        credentials: "include",
    });
    
    return handleApiResponse(res);
}

export const logoutService = async () => {
    const res = await fetch('/api/users/logout', {
        method: "POST",
        credentials: "include",
    });

    return handleApiResponse(res);
}

export const loginService = async (formData) => {
    const res = await fetch('/api/users/login', {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify(formData),
    });

    return handleApiResponse(res);
}

export const signupService = async (formData) => {
    const res = await fetch('/api/users/signup', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    return handleApiResponse(res);
}