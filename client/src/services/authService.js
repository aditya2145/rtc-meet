export const getMeService = async () => {
    const res = await fetch('/api/users/me', {
        credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
    }
    return data;
}

export const logoutService = async () => {
    const res = await fetch('/api/users/logout', {
        method: "POST",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
    }
    return data;
}

export const loginService = async (formData) => {
    const res = await fetch('/api/users/login', {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify(formData),
    })
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
    }
    return data;
}

export const signupService = async (formData) => {
    const res = await fetch('/api/users/signup', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
    }
    return data;
}