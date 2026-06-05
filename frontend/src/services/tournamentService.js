import API from "./api";

export const getTournaments = (params = {}) => {
    return API.get("/tournaments", { params });
};

export const searchTournaments = (search) => {
    return API.get("/tournaments", {
        params: {
            active: true,
            search,
            limit: 6
        }
    });
};

export const createTournament = (data) => {
    return API.post("/tournaments", data);
};

export const updateTournament = (id, data) => {
    return API.put(`/tournaments/${id}`, data);
};

export const registerToTournament = (data) => {
    return API.post("/tournaments/register", data);
};

export const getMyTournaments = (userId) => {
    return API.get(`/tournaments/my-registrations/${userId}`);
};

export const updateTournamentStatus = (id, data) => {
    return API.put(`/tournaments/${id}/status`, data);
};
