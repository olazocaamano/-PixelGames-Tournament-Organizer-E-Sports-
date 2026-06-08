# Project Context

This is a full-stack tournament system built with:

Frontend:
- React
- Axios API layer
- Socket.io-client (real-time events)

Backend:
- Node.js
- Express
- MySQL
- Socket.io (real-time server)

Main Features:
- Tournament CRUD with real-time updates
- Player registration with live confirmation
- Activity logging
- Admin control panel with search and edit
- Real-time dashboard synchronization
- Cyber Neon gaming-themed UI
- Animated particle background (Canvas)
- Password reset via email (Nodemailer)
- Admin management (create, list, demote)
- Match & Bracket management (auto-generate, report results, bracket viewer)
- Player profiles with win/loss stats, win rate, match history
- Global and per-tournament Leaderboards
- In-app Notifications (real-time)
- Admin Registration management (view, remove players)
- Tournament Results & Standings with bracket view
- Advanced Statistics (activity timeline, game popularity, top players)

Important Endpoints:
- GET /api/tournaments — list tournaments (supports `?active=`, `?search=`, `?limit=`, `?offset=`)
- POST /api/tournaments — create tournament (admin only)
- PUT /api/tournaments/:id — update tournament (admin only)
- PUT /api/tournaments/:id/status — change status (admin only)
- POST /api/tournaments/register — user registers for a tournament
- GET /api/tournaments/my-registrations/:user_id — get user's registered tournaments
- GET /api/tournaments/:id/registrations — list registrations (admin only)
- DELETE /api/tournaments/:tid/registrations/:uid — remove registration (admin only)
- GET /api/tournaments/:id/results — tournament standings and matches
- POST /api/users/forgot-password — request password reset email (public)
- POST /api/users/reset-password — reset password with token (public)
- GET /api/users/admins — list all admin users (admin only)
- POST /api/users/admin — create a new admin user (admin only)
- PATCH /api/users/:id/demote — demote admin to regular user (admin only)
- GET /api/users/profile/:userId — player profile with stats
- GET /api/matches/tournament/:id — get tournament matches
- GET /api/matches/player/:userId — get player's matches
- POST /api/matches — create a match (admin only)
- PUT /api/matches/:id/result — report match result (admin only)
- POST /api/matches/generate/:id — auto-generate brackets (admin only)
- GET /api/leaderboards — global leaderboard
- GET /api/leaderboards/tournament/:id — per-tournament leaderboard
- GET /api/notifications/:userId — get user notifications
- PUT /api/notifications/:id/read — mark notification as read
- PUT /api/notifications/read-all/:userId — mark all as read
- GET /api/stats — system statistics (admin only)

Real-time Events (Socket.io):
- `tournament:created` — broadcast when admin creates a tournament
- `tournament:updated` — broadcast when admin edits a tournament
- `tournament:statusChanged` — broadcast when admin changes status
- `tournament:registered` — sent to specific user room on registration
- `match:created` — broadcast when admin creates a match
- `match:result` — broadcast when match result is reported
- `tournament:bracketsGenerated` — broadcast when brackets are generated
- `registration:removed` — broadcast when admin removes a registration
- `notification` — sent to specific user room for new notifications

Architecture:
- Frontend uses services layer (`/services`) to communicate with backend via Axios
- Backend follows MVC pattern (controllers, routes, utils)
- Socket.io server stored in `socketEmitter.js` singleton, accessible from any controller
- Client connects via `connectSocket(userId)` and joins a room `user:{userId}` for targeted events
- Real-time updates trigger automatic list refreshes in both admin and player dashboards
- BackgroundAnimation.jsx uses Canvas API with requestAnimationFrame for 60fps particle effects
- Email service (emailService.js) uses Nodemailer with configurable SMTP or Ethereal fallback