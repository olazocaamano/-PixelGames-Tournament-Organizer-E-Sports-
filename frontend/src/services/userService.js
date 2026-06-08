import API from "./api";

export const loginUser = (data) => {
    return API.post("/users/login", data);
};

export const registerUser = (data) => {
    return API.post("/users", data);
};

export const forgotPassword = (email) => {
    return API.post("/users/forgot-password", { email });
};

export const resetPassword = (token, password) => {
    return API.post("/users/reset-password", { token, password });
};