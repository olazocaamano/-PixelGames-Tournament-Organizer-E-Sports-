import API from "./api";

export const getGlobalLeaderboard = () => {
    return API.get("/leaderboards");
};

export const getTournamentLeaderboard = (tournamentId) => {
    return API.get(`/leaderboards/tournament/${tournamentId}`);
};
