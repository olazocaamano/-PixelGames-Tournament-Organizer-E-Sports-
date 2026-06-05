require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db');
const path = require('path');

const gamesRoutes = require('./routes/gamesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const tournamentsRoutes = require('./routes/tournamentsRoutes');
const activityRoutes = require('./routes/activityRoutes');

const { setIO } = require('./utils/socketEmitter');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        methods: ['GET', 'POST', 'PUT']
    }
});

setIO(io);

io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('join:user', (userId) => {
        if (userId) {
            socket.join(`user:${userId}`);
            console.log(`[Socket] User ${userId} joined room user:${userId}`);
        }
    });

    socket.on('disconnect', () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
});

// Middlewares
app.use(cors());//So that React can connect without blocking
app.use(express.json());//For the server to understand data in JSON format
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Routes (Endpoints)
app.use('/api/games', gamesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tournaments', tournamentsRoutes);
app.use('/api/activity', activityRoutes);

//Test route to see if the server is live
app.get('/', (req, res) => {
    res.send('The eSports server is up and running');
});

//Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`\n==========================================`);
    console.log(`Running server in: http://localhost:${PORT}`);
    console.log(`==========================================\n`);
});