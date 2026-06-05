import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, {
    autoConnect: false
});

export function connectSocket(userId) {
    if (!socket.connected) {
        socket.connect();
    }
    socket.emit("join:user", userId);
}

export function disconnectSocket() {
    if (socket.connected) {
        socket.disconnect();
    }
}

export default socket;
