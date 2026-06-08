# CHANGELOG

## Component Version Variation Dictionary

This table defines the prefixes used to identify which component of the system is affected by a version change.

| Prefix     | Component      | Description                                                                                        | Example Version |
| ---------- | -------------- | -------------------------------------------------------------------------------------------------- | --------------- |
| **FE**     | Frontend       | Changes in the user interface, visual components, client-side logic, or user experience.           | [FE]-1.2.0      |
| **BE**     | Backend        | Changes in server-side logic, services, controllers, authentication, or application processing.    | [BE]-2.0.1      |
| **API**    | API Services   | Changes to API endpoints, request/response structure, or service contracts.                        | [API]-1.3.0     |
| **DB**     | Database       | Modifications to database schema, tables, relationships, migrations, or constraints.               | [DB]-1.1.0      |
| **SEC**    | Security       | Security fixes, vulnerability patches, authentication improvements, or access control changes.     | [SEC]-1.0.2     |
| **INFRA**  | Infrastructure | Changes related to deployment, servers, containers, CI/CD pipelines, or environment configuration. | [INFRA]-0.4.1   |
| **TEST**   | Testing        | Addition or modification of automated tests, test cases, or testing environments.                  | [TEST]-0.3.0    |
| **DOC**    | Documentation  | Updates or corrections to technical documentation, guides, or project specifications.              | [DOC]-1.0.1     |
| **CONFIG** | Configuration  | Changes in system configuration files, environment variables, or runtime settings.                 | [CONFIG]-0.2.3  |


---

## Version [FE]-v13.0.0 / [BE]-v13.0.0 / [API]-v13.0.0 / [DB]-v13.0.0 / [DOC]-v13.0.0
### Match brackets, player profiles, leaderboards, notifications, registration management & advanced statistics (June 08, 2026)

This sprint introduced a complete match bracket system with automatic pairing, player profiles with win/loss tracking, global and per-tournament leaderboards, in-app notifications, admin registration management, enhanced statistics, and tournament results views.

---

### Added

- **Match bracket system:**
  - `backend/controllers/matchesController.js` — Full match CRUD with bracket generation
  - `POST /api/matches/generate/:tournamentId` — Auto-pairs registered players randomly and creates round matches
  - `PUT /api/matches/:id/result` — Report match winner with winner validation
  - `GET /api/matches/tournament/:tournamentId` — Get matches grouped by round
  - `GET /api/matches/player/:userId` — Get player's match history
  - `frontend/src/components/BracketViewer.jsx` — Visual bracket tree organized by round (Final → Semi-finals → Quarter-finals → Round 1)
  - Admin "Brackets" section with generate and report result controls
  - Player "My Matches" section showing win/loss per match
  - Real-time socket events: `match:created`, `match:result`, `notification`
  - Activity logging for match creation and results
- **Player profiles:**
  - `GET /api/users/profile/:userId` — Stats: wins, losses, win rate, total matches, tournaments played
  - `frontend/src/pages/Profile.jsx` — Public profile page with avatar, stat cards, recent match history
  - Color-coded win/loss indicators and match history timeline
- **Leaderboards:**
  - `GET /api/leaderboards` — Global rankings with win rate, match count, tournament count (top 100)
  - `GET /api/leaderboards/tournament/:tournamentId` — Per-tournament rankings
  - `frontend/src/pages/Leaderboards.jsx` — Tabbed interface (Global / Per Tournament) with medal icons
- **Registration management (Admin):**
  - `GET /api/tournaments/:id/registrations` — List all registrations for a tournament
  - `DELETE /api/tournaments/:tournamentId/registrations/:userId` — Remove player registration
  - New Admin "Registrations" section with tournament selector, player table, and remove buttons
  - Profile links for each registered player
- **Tournament results:**
  - `GET /api/tournaments/:id/results` — Full tournament data, standings sorted by wins, all matches
  - `frontend/src/pages/TournamentResults.jsx` — Standings table, bracket toggle, match list with winners
  - Accessible from both Admin and Player dashboards
- **In-app notifications:**
  - New `notifications` database table (SQL in `consults/notifications.sql`)
  - `GET /api/notifications/:userId` — Fetch notifications with unread count
  - `PUT /api/notifications/:id/read` — Mark single notification as read
  - `PUT /api/notifications/read-all/:userId` — Mark all as read
  - Notification dropdown in Player dashboard with unread badge
  - Real-time notifications via Socket.io for match assignments, wins/losses, registration changes
- **Advanced statistics (Admin):**
  - `GET /api/stats` — Tournaments (total/active/pending/finished), users (admins/players), matches (completed/pending), registrations, activity timeline (30-day line chart), game popularity (bar chart), top 10 players by wins
  - Enhanced Admin "Statistics" section with 4 summary cards, 3 charts, and top players table
- **New frontend services:**
  - `matchService.js` — Tournament/player matches, create, report result, generate brackets
  - `leaderboardService.js` — Global and per-tournament leaderboards
  - `notificationService.js` — Fetch, mark read, mark all read
- **Enhanced `getTournaments` query** — Now includes `game_name` and `status_name` via JOINs
- **New pages:** `/profile/:userId`, `/leaderboards`, `/tournament/:id/results`

### Changed

- `frontend/src/App.css` — Major animation overhaul:
  - `expandBar` animation replaced with smooth `slideDownBar` (translateY + scale + glow)
  - `.bar` uses gradient background, fixed border-radius, `overflow: visible`
  - `.admin-box` changed from fixed `height: 560px` to `height: auto; min-height: 560px`
  - Added styles for `select`, `table`, `th`, `td` with Cyber Neon theme
  - Menu items reduced from 25px to 13px font with 32px height for better fit
  - `.left h1` reduced from 40px to 24px
  - `.logout` selector fixed to `.menu .logout` with proper red (`#dc2626`)
  - Added responsive breakpoints at 1200px and 768px
  - Animations use `cubic-bezier(0.16, 1, 0.3, 1)` for smooth spring-like motion
- `backend/controllers/tournamentsController.js` — Added `getTournamentRegistrations`, `removeRegistration`, `getTournamentResults`; enhanced `getTournaments` query with game/status JOINs
- `backend/index.js` — Registered 4 new route modules (matches, leaderboards, notifications, stats)
- `frontend/src/pages/Admin.jsx` — Added Registrations tab, Brackets tab with BracketViewer, enhanced Statistics with 3 charts and top players
- `frontend/src/pages/Player.jsx` — Added My Matches section, notification dropdown with badge, Leaderboards link, My Profile link, bracket view for registered tournaments
- `frontend/src/App.jsx` — Added 3 new routes
- `frontend/src/services/tournamentService.js` — No changes needed (compatible)

### Security

- Match result endpoint validates winner is one of the two players in the match
- Registration management requires admin authentication and authorization
- Notification endpoints require authenticated user matching the requested userId

---

## Version [FE]-v12.0.0 / [BE]-v12.0.0 / [API]-v12.0.0 / [DB]-v12.0.0 / [CONFIG]-v12.0.0 / [DOC]-v12.0.0
### Cyber Neon redesign, animated background, password reset & admin management (June 06–07, 2026)

This sprint introduced a full visual overhaul with the Cyber Neon palette, a Canvas-based animated particle background, a complete password reset flow via email, and admin management capabilities (create, list, demote).

---

### Added

- **Cyber Neon visual redesign (`App.css`):**
  - New dark gradient background (`#0b0f1a` → `#141b2b`)
  - Cyan (`#00e5ff`, `#0891b2`) as primary accent replacing green
  - Purple (`#a855f7`) as secondary accent
  - Slate-based surfaces (`#1a2035`, `#222a40`) replacing generic grays
  - Updated semantic colors: `#22c55e` (success), `#f59e0b` (warning), `#ef4444` (error), `#64748b` (neutral)
  - Consistent text hierarchy: `#f1f5f9` (primary), `#94a3b8` (muted)
  - `rgba(0, 229, 255, ...)` glows and hover effects throughout the UI
- **Animated particle background:**
  - `frontend/src/components/BackgroundAnimation.jsx` — Canvas-based engine with 50 floating pixel particles
  - Particles in cyan, purple, and green with subtle glow (`shadowBlur`)
  - Proximity-based connection lines for a cyber-grid effect
  - Automatic resize, `pointer-events: none`, zero performance impact on UI
- **Password reset flow:**
  - `backend/utils/emailService.js` — Nodemailer transporter with SMTP config or Ethereal fallback
  - `backend/controllers/usersController.js` — `forgotPassword` (generates crypto token, stores in DB, sends email) and `resetPassword` (validates token, updates bcrypt hash)
  - `frontend/src/pages/ForgotPassword.jsx` — Email input page (styled like admin login)
  - `frontend/src/pages/ResetPassword.jsx` — New password form with token from URL params
  - `password_resets` database table with 1-hour token expiry
  - Activity logging for reset requests and completions
- **Admin management:**
  - `POST /api/users/admin` — Create admin (protected, admin-only)
  - `GET /api/users/admins` — List all admin users
  - `PATCH /api/users/:id/demote` — Demote admin to player (prevents self-demotion)
  - Admin panel "Admins" tab with create form + current admins list + demote buttons
  - Activity logging for admin creation and demotion

---

### Changed

- `App.css` — All 1196 lines reviewed; every color value migrated to Cyber Neon palette
- `App.jsx` — Now wraps `<BackgroundAnimation />` as first child with `z-index: 0`, content at `z-index: 1`
- `Home.jsx` — Password reset link redirected from `/reset` (dead route) to `/forgot-password`
- `backend/.env` — Added `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `FRONTEND_URL` variables
- `backend/package.json` — Added `nodemailer` dependency
- `frontend/src/services/userService.js` — Added `forgotPassword(email)` and `resetPassword(token, password)` API functions

---

### Fixed

- Dead route `/reset` in `Home.jsx` — now correctly points to `/forgot-password`
- Overly aggressive `rgba(0,0,0,0.6)` replacement reverted to correct values for box-shadows and modal overlay

---

### In Progress

- Bracket/match generation and management
- Player participation analytics per tournament
- Advanced statistics (time-based activity tracking)
- Admin controls for registration management

---

### System Status

- UI fully restyled with gaming-oriented Cyber Neon theme
- Password reset flow complete: forgot → email → reset token → new password → redirect to login
- Admin management operational: create, list, demote with real-time activity logging
- Animated background runs at 60fps with zero UI interference

---

### Notes

- SMTP must be configured in `.env` for production emails. Without it, emails are sent via Ethereal (test accounts) with preview URL shown in backend console and API response.
- The password reset token expires in 1 hour. A single-use policy is enforced.
- Admins cannot demote themselves. A minimum of one admin must remain.

---

## Version [FE]-v11.0.0 / [BE]-v11.0.0 / [API]-v11.0.0 / [DOC]-v11.0.0
### Real-time tournament control, admin search & edit, player dashboard (June 04, 2026)

This sprint introduced real-time communication via Socket.io, allowing admin tournament changes to reflect instantly on connected player dashboards. The admin panel now includes a tournament search bar and a complete edit modal with status control. Players have a dedicated "My Tournaments" section showing their registrations with live status updates.

---

### Added

- **Real-time engine (Socket.io):**
  - `backend/utils/socketEmitter.js` — singleton to share the Socket.io `Server` instance across controllers
  - `frontend/src/services/socket.js` — client-side socket connection with `connectSocket(userId)` and `disconnectSocket()`
  - Socket.io server integration in `backend/index.js` via `http.createServer` + room-based events (`join:user`)
- **Backend socket events emitted after each operation:**
  - `tournament:created` (broadcast) — when admin creates a tournament
  - `tournament:updated` (broadcast) — when admin edits a tournament
  - `tournament:statusChanged` (broadcast) — when admin changes tournament status
  - `tournament:registered` (user room) — emitted to the specific user who registered
- **Player "My Tournaments" section:**
  - New nav button + dedicated page in `Player.jsx` listing all tournaments the user has joined
  - Home section quick preview of registered tournaments with status badges
  - Real-time listener for `tournament:registered`, `tournament:created`, `tournament:updated`, `tournament:statusChanged` events
- **Admin tournament search bar:**
  - Client-side filtering by name in the "Tournament Control" section
  - Tournament list now loads up to 1000 entries (was 10) so search works across all tournaments
- **Complete edit modal for tournaments:**
  - Fields: Name, Game (dropdown from DB), Prize Pool, Start Date, Status (Pending/Active/Finished), Active toggle
  - `handleEditFieldChange` handler with proper numeric conversion
- **Games dropdown** — admin edit form loads active games via `GET /api/games?active=true`
- **API endpoint:** `GET /api/tournaments/my-registrations/:user_id` — returns all tournaments a user is registered for
- **`onRegisterSuccess` callback** in `TournamentAutocomplete.jsx` to notify parent on successful registration

---

### Changed

- `backend/index.js` — migrated from `app.listen()` to `http.createServer(app)` + `server.listen()` for Socket.io compatibility
- `backend/controllers/tournamentsController.js` — all CRUD operations now emit socket events; added `getMyTournaments` export
- `backend/routes/tournamentsRoutes.js` — added `GET /my-registrations/:user_id` route
- `Admin.jsx` — tournament section redesigned: added search input, games fetch, count display, and full edit form
- `Player.jsx` — complete rewrite with "My Tournaments" section, socket connection, and live status updates
- `TournamentAutocomplete.jsx` — accepts optional `onRegisterSuccess` prop
- `tournamentService.js` — added `getMyTournaments(userId)` and `fetchTournaments` now passes `{ limit: 1000 }`
- `backend/package.json` — added `socket.io` dependency
- `frontend/package.json` — added `socket.io-client` dependency

---

### Fixed

- Admin tournament list was limited to 10 results; now loads up to 1000
- Edit tournament modal had empty form fields (`{/* form fields */}`); now fully implemented
- Unused `handleEditChange` handler removed from `Admin.jsx`
- Socket event listeners now properly cleaned up on unmount via `socket.off()`

---

### In Progress

- Bracket/match generation and management
- Player participation analytics per tournament
- Advanced statistics (time-based activity tracking)
- Admin controls for registration management

---

### System Status

- All tournament CRUD operations reflected in real-time across admin and player sessions
- Player dashboard now shows live-updating registered tournaments
- Admin panel has full search and edit capabilities
- Frontend, backend, database, and WebSocket layers are fully integrated and stable

---

### Notes

- Restart the backend server (`node backend/index.js`) for Socket.io changes to take effect
- Socket.io auto-connects when the player/admin dashboard loads and disconnects on logout
- Room-based events ensure `tournament:registered` only reaches the intended user


---

## Version [SEC]-v10.0.0 / [BE]-v10.0.0 / [FE]-v10.0.0 / [DB]-v10.0.0 / [CONFIG]-v10.0.0 / [DOC]-v10.0.0
### JWT Authentication, database integrity, security hardening, and documentation overhaul (June 04, 2026)

This sprint focused on hardening security, enforcing referential integrity, and cleaning up technical debt. JWT-based authentication was implemented to replace the insecure localStorage-only session model. All API routes are now protected with token validation and role-based authorization. The database schema was updated with full FOREIGN KEY constraints. Multiple frontend bugs were fixed and unused dependencies were removed.

---

### Added

- JWT-based authentication system:
  - Token generation on login and registration (`jsonwebtoken`)
  - `authMiddleware.js` with `authenticate` (token validation) and `authorize` (role-based access) middleware
  - Token expiry configuration via `JWT_EXPIRES_IN` environment variable
- Axios request interceptor for automatic JWT attachment to all API calls
- `backend/utils/authMiddleware.js` — centralized authentication and authorization middleware
- `JWT_SECRET` and `JWT_EXPIRES_IN` environment variables
- FOREIGN KEY constraints across all 8 database tables:
  - `USERS.role_id` → `ROLES.id`
  - `TOURNAMENTS.game_id` → `GAMES.id`
  - `TOURNAMENTS.status_id` → `STATUS.id`
  - `TOURNAMENTS.creator_id` → `USERS.id`
  - `REGISTRATION.user_id` → `USERS.id`
  - `REGISTRATION.tournament_id` → `TOURNAMENTS.id`
  - `MATCHES.tournament_id` → `TOURNAMENTS.id`
  - `MATCHES.player_1_id` → `USERS.id`
  - `MATCHES.player_2_id` → `USERS.id`
  - `MATCHES.winner_id` → `USERS.id`
  - `ACTIVITY.user_id` → `USERS.id`
  - `ACTIVITY.tournament_id` → `TOURNAMENTS.id`
  - `ACTIVITY.game_id` → `GAMES.id`
  - `ACTIVITY.match_id` → `MATCHES.id`
- `image_url` column to `GAMES` table

---

### Changed

- Migrated database credentials from hardcoded values in `db.js` to environment variables (`.env`)
- `USERS.role VARCHAR(20)` → `USERS.role_id INT NOT NULL` with FK to `ROLES`
- Controllers now derive `creator_id`, `editor_id`, and `admin_id` from `req.user` (JWT payload) instead of accepting them from client requests
- Login and registration endpoints now return a signed JWT token alongside user data
- `PlayersList.jsx` — replaced raw `fetch()` with centralized `API` service (Axios)
- `RegisterTournament.jsx` — replaced hardcoded `axios.get()` with `API` service and corrected route from `/api/register` to `/api/tournaments/register`
- `tournamentService.js` — corrected `registerToTournament` route to `/tournaments/register`
- Admin access link removed from `Home.jsx` — admin login is now accessed exclusively via `/admin/login` URL
- `chartOptions` in `Admin.jsx` — merged duplicate `plugins` and `scales` definitions into a single configuration
- `UserRegister.jsx` — now stores JWT token and redirects to player dashboard on successful registration
- Logout handlers in `Admin.jsx`, `Player.jsx`, `AdminLogin.jsx` — now clear `token` from localStorage

---

### Fixed

- ❌ `rgba(0, 0, 0, 0.2.5)` invalid CSS syntax → corrected to `rgba(0, 0, 0, 0.5)` in modal overlay (`App.css:762`)
- ❌ Hardcoded `http://localhost:5000` URLs replaced with centralized `API` instance in `PlayersList.jsx` and `RegisterTournament.jsx`
- ❌ `POST /api/register` wrong route → corrected to `POST /api/tournaments/register`
- ❌ Unused `nodemailer` dependency removed from `backend/package.json`

---

### Security

- All protected routes now require a valid JWT token via `Authorization: Bearer <token>` header
- Role-based access enforced:
  - `authenticate` middleware validates the token on every request
  - `authorize('admin')` restricts admin-only endpoints
  - Player registration endpoint (`POST /api/tournaments/register`) requires authentication
- Server no longer trusts client-provided user IDs (`creator_id`, `editor_id`, `admin_id`)
- Database credentials moved from source code to `.env` environment variables
- `.env` is already included in `.gitignore` — credentials are never committed

---

### Removed

- `nodemailer` dependency from backend (unused)
- Hardcoded database credentials from `backend/db.js`
- `console.log("Successfully connected to MySQL!")` from `backend/db.js`
- Admin access link from home page (now accessible only via direct URL `/admin/login`)
- Duplicate `plugins` and `scales` blocks in `Admin.jsx` chart configuration

---

### In Progress

- Tournament status management (finish/cancel tournaments)
- Player participation analytics per tournament
- Advanced statistics (time-based activity tracking)
- Admin controls for registrations

---

### System Status

- All API endpoints secured with JWT authentication and role-based authorization
- Database schema now enforces referential integrity via FOREIGN KEY constraints
- Full flow verified:
  - Register → Login → View games → Join tournament → Admin panel
- Frontend, backend, and database remain fully integrated and stable

---

### Notes

- Existing users from seed scripts remain valid — JWT is generated at login time
- Token expiration defaults to 24 hours; configurable via `JWT_EXPIRES_IN`
- Future sprints should focus on analytics, bracket generation, and deployment configuration

---

## Version [API]-v9.8.0 / [FE]-v9.8.0 / [BE]-v9.8.0 / [DB]-v9.8.0  
### Tournament registration, system fixes and admin statistics (May 05, 2026)

This sprint focused on stabilizing the system, fixing critical integration errors, 
and implementing tournament registration along with administrative statistics visualization.

---

### Added

- Tournament registration functionality (player → tournament)
- Autocomplete search component for tournaments
- Backend endpoint for tournament registration
- Games endpoint `/api/games` for frontend carousel
- Static file serving for game images
- Admin statistics section with dynamic chart (Chart.js)
- Calculation of system metrics:
  - Total tournaments
  - Active tournaments
  - Finished tournaments
  - Total players
  - Average prize pool

---

### Changed

- Fixed API route structure (`/api/users`, `/api/games`, `/api/tournaments`)
- Standardized service layer methods in frontend (`tournamentService`)
- Improved error handling for:
  - Login
  - Tournament creation
  - Tournament registration
- Updated Admin dashboard to include statistics visualization
- Improved UI styling for charts (dark mode + responsive design)
- Refactored tournament creation flow to avoid NULL values in DB

---

### Fixed

- ❌ 404 error: `POST /api/register` → corrected to proper endpoint
- ❌ `Cannot GET /api/games` → fixed missing route in backend
- ❌ Images not loading → fixed static path configuration
- ❌ Login failing → fixed missing `/api/users/login` route
- ❌ MySQL error `Column 'name' cannot be null`
- ❌ Missing exports in `tournamentService.js`
- ❌ Autocomplete not showing results (wrong service usage)
- ❌ Chart rendering without real data

---

### In Progress

- Tournament status management (finish/cancel tournaments)
- Player participation analytics per tournament
- Advanced statistics (time-based activity tracking)
- Admin controls for registrations

---

### System Status

- Full flow achieved:
  - Register → Login → View games → Join tournament → Admin control
- Frontend, backend, and database are fully connected
- System is stable and functional for core features

---

### Notes

- Future improvements will focus on analytics and scalability
- UI/UX polishing pending for admin dashboard
- Additional validation recommended for edge cases

---

## Version [API]-v0.9.5 / [FE]-v0.9.5 / [DB]-v0.9.5 
### Tournament management and system integration (April 22, 2026)

This sprint focused on implementing tournament management and achieving a functional system flow 
by integrating frontend, backend, and database components.

### Added
- Tournament creation form in frontend
- Tournament list view UI
- Initial integration between frontend, backend, and database

### Changed
- Improved error handling in UI and backend responses
- Updated database relationships (STATUS, USERS)

### In Progress
- Tournament endpoints (register and retrieve)
- Database validation and query testing
- Dynamic display of tournaments from backend

### System Status
- Functional flow achieved: register → login → create tournament
- Partial backend implementation for tournament

### Notes
- Full tournament CRUD is not yet completed
- Backend endpoints require final implementation

---

## Scrum Integration

This project follows an adaptive Scrum approach.
Development history has been organized into sprints:

- Sprint 1 → Database & Authentication base
- Sprint 2 → Frontend & Player visualization
- Sprint 3 → Security improvements
- Sprint 4 → Tournament management & full system integration

See `/docs/scrum` folder for backlog and sprint details.

---

## Version [SEC]-v0.9.0 - Password encryption and error handling improvements (April 08, 2026)

User authentication was improved by adding password encryption and better error handling during registration and login.  
These changes help protect user data and provide clearer feedback when something goes wrong.

### Changes

- Added password encryption using bcrypt when registering users.
- Updated login to compare encrypted passwords instead of plain text.
- Removed direct password validation in SQL queries.
- Added validation to avoid duplicate usernames and emails.
- Handled database errors for duplicate entries.
- Improved backend responses with clear error messages.
- Connected backend errors with frontend messages.
- Displayed error messages in the registration form.
- Cleared messages when the user modifies input fields.

---

## Version [FE]-v0.8.6 - Frontend structure refactoring (April 05, 2026)

The frontend project structure was reorganized to improve code maintainability and scalability.
Files were separated into pages, components, services, and utility functions to follow a more modular architecture.

### Changes

- Reorganized frontend folder structure.
- Separated main views into `/pages`.
- Extracted reusable UI elements into `/components`.
- Centralized API calls into `/services`.
- Moved helper functions into `/utils`.
- Improved project readability and maintainability.

### New Structure

```bash  
/src  
    /pages  
        Home.jsx  
        Admin.jsx  
        Player.jsx  
        AdminLogin.jsx  
        UserRegister.jsx  
    /components  
        CreateTournament.jsx  
        TournamentList.jsx  
        ActivityList.jsx  
        Modal.jsx  
    /services  
        api.js  
        tournamentService.js  
        userService.js  
    /hooks
    /utils  
        formatDate.js  
    App.jsx
```

---
## Version [BE]-v0.8.5 - Player retrieval endpoint added (April 05, 2026)

### Changes

- Added endpoint to retrieve all registered players.
- Implemented query to filter users by role.

---

## Version [FE]-0.8.4 - Player visualization implementation (April 05, 2026)

A new section was implemented in the admin panel to display all registered players from the database.
This feature improves user management visibility and allows administrators to easily view player information within the system.

### Changes

- Added player list section in the admin panel.
- Displayed player information in the user interface.
- Integrated player view into existing navigation system.

---

## Version [DB]-v0.8.3 - DDL Schema Implementation from Existing Design (March 24, 2026)

The database schema was created in SQL based on the Data Dictionary and ER diagram that were already defined before.
This version does not change the database design. It only converts the existing design into SQL code using DDL statements.
Some small corrections were made to the Data Dictionary to make sure it matches the SQL structure.
The file `01_schema_tables.sql` was created, including all main tables. Foreign keys are not included yet and will be added in a future version.

### Changes

- Added `01_schema_tables.sql` with all table definitions.
- Converted the Data Dictionary into SQL `CREATE TABLE` statements.
- Followed coding standards (table names, column names, constraints).
- Checked consistency between Data Dictionary, ER diagram, and SQL code.
- Made small corrections in the Data Dictionary.

---

## Version [FE]-v0.8.1 - Code correction in role validations (March 23, 2026)

Login validations were corrected, primarily for the administrator login, to utilize the `ROLES` table created a few versions back. This improves data flow and prevents potential errors due to spelling mistakes.
This update coincides with version [![Version](https://img.shields.io/badge/version-v0.8.0-blue)](https://github.com/olazocaamano/VideoGames-Tournament/blob/main/CHANGELOG.md#version-be-v080---implementation-of-inner-join-for-the-users-table-march-23-2026)

## Changes

- Correction: `Player -> player` and `Admin -> admin`

---

## Version [BE]-v0.8.0 - Implementation of INNER JOIN for the `USERS` table (March 23, 2026)

The login query was corrected to correctly relate the `USERS` table to the `ROLES` table using an **INNER JOIN** and to relate the `id` and `role_id`
columns.

### Changes

- Added:

```
    SELECT
        u.id,
        u.username,
        r.role_name
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE u.username = ? AND u.password = ?
```

---

## Version [DOC]-v0.7.4 - Data Dictionary Relationship Summary Added (March 12, 2026)

A new section was added to the Data Dictionary to summarize the relationships between the main entities in the database.  
This improves documentation clarity and allows readers to quickly understand how the tables are connected without needing to analyze the full ER diagram.

### Changes

- Added **Entity Relationship Summary** section to the Data Dictionary.
- Documented the main parent-child relationships between database tables.
- Improved readability of database documentation.

---

## Version [DB]-v0.7.3 - Implementation of ROLES Table (March 12, 2026)

The **ROLES** table was added to improve role management in the system.  
Instead of storing user roles as an ENUM field in the **USERS** table, a relational approach was implemented using a dedicated table and a foreign key.

This change improves database normalization, flexibility, and consistency in role assignment.

### Changes

- Added new table **ROLES** to store system roles.
- Removed the **ENUM role** field from the **USERS** table.
- Added field **role_id** in **USERS** as a foreign key referencing **ROLES.id**.
- Established a new relationship between **ROLES** and **USERS**.
- Improved database normalization by replacing ENUM with a relational role catalog.

---

## Version [DB]-v0.7.2 - Implementation of STATUS Table (March 11, 2026)

The **STATUS** table was introduced to improve the management of status values used in the system.  
Instead of storing the status as a specific field using an ENUM type, it was replaced with a relational approach by creating a separate table and linking it through a foreign key.

This change was suggested by the **Database Administrator (DBA)**, who identified that using a dedicated table would provide better flexibility, normalization, and scalability for the database design.

### Changes

- Added new table **STATUS** to store tournament status values.
- Removed the **ENUM status** field from the **TOURNAMENTS** table.
- Added the field **status_id** in **TOURNAMENTS** as a foreign key referencing **STATUS.id**.
- Established a new relationship between **STATUS** and **TOURNAMENTS** to manage tournament states through relational data.
- Improved database normalization and future scalability by replacing ENUM with a catalog table.
- Replaced field `status` with `status_id` in the **TOURNAMENTS** table.

---

## Version [DB]-v0.7.1 - Correction of Relationship Names (March 11, 2026)

The names of the relationships between tables were updated to improve clarity and readability.  
These changes were suggested by **The Query Master** together with the **Database Administrator**, who identified that some relationship descriptions were ambiguous or inconsistent.

### Changes

- Updated relationship **GAMES → TOURNAMENTS**
  - `belongs_to` → `used_in`
  - Clarifies that tournaments are played using a specific game.

- Updated relationship **TOURNAMENTS → REGISTRATION**
  - `belongs_to` → `accepts`
  - Represents that tournaments accept multiple registrations.

- Corrected typo in relationships with **ACTIVITY**
  - `longs` → `logs`
  - Indicates that activity records or logs actions related to matches and games.

- Improved semantic clarity in relationship descriptions to better reflect system behavior.

---

## Version [DB]-v0.7.0 - Correction of Tables and Data Dictionary (March 10, 2026)

Corrections were applied to the database tables and the data dictionary based on the suggestions provided by **The Query Master** and **The SQL Tester**. These adjustments improve consistency, constraints, and relational integrity in the database design.

### Changes

- Added `UNIQUE` constraints to fields such as **username**, **email**, and **game_name**.
- Corrected foreign key references (`USER` → `USERS`, `TOURNAMENT` → `TOURNAMENTS`, `MATCH` → `MATCHES`).
- Improved descriptions in the **Data Dictionary** for better clarity and accuracy.
- Added a composite constraint `UNIQUE(user_id, tournament_id)` in the **REGISTRATION** table to prevent duplicate registrations.
- Standardized naming of tables and fields across the schema.

---

## Version [DOC]-v0.6.0 - Version Documentation Added (March 10, 2026)

The **CHANGELOG.md** file was created to better record program versions, allowing for detailed visualization of changes and improving workflow.

### Changes

- Added the `CHANGELOG.md` file to the repository.
- Added the **Component Version Variation Dictionary** table to explain version prefixes.
