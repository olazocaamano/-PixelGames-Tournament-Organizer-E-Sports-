require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');

const gamesRoutes = require('./routes/gamesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const tournamentsRoutes = require('./routes/tournamentsRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();

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
app.listen(PORT, () => {
    console.log(`\n==========================================`);
    console.log(`Running server in: http://localhost:${PORT}`);
    console.log(`==========================================\n`);
});