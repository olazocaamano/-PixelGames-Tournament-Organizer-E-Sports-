import API from "./api";

export const getTournamentMatches = (tournamentId) => {
    return API.get(`/matches/tournament/${tournamentId}`);
};

export const getPlayerMatches = (userId) => {
    return API.get(`/matches/player/${userId}`);
};

export const createMatch = (data) => {
    return API.post("/matches", data);
};

export const reportResult = (matchId, winnerId) => {
    return API.put(`/matches/${matchId}/result`, { winner_id: winnerId });
};

export const generateBrackets = (tournamentId) => {
    return API.post(`/matches/generate/${tournamentId}`);
};
