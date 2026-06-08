import API from "./api";

export const getNotifications = (userId) => {
    return API.get(`/notifications/${userId}`);
};

export const markAsRead = (id) => {
    return API.put(`/notifications/${id}/read`);
};

export const markAllAsRead = (userId) => {
    return API.put(`/notifications/read-all/${userId}`);
};
