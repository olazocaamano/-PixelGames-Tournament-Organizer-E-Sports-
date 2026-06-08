# eSports Tournament Management System - User Stories

This repository contains the functional requirements for the eSports platform. The following user stories define the core features and the project scope.

---

## Project Roadmap and Priorities

| ID | Title | Role | Priority | Dependency |
| :--- | :--- | :--- | :---: | :---: |
| **US-01** | Platform Management | General Admin | 100 | None |
| **US-02** | Profile and Participation | Player | 200 | US-01 |
| **US-03** | Competition Control | Tournament Admin | 300 | US-02 |
| **US-04** | Visualization and Results | General User | 400 | US-03 |
| **US-05** | Authentication and Security | Admin / Player | 150 | US-01 |
| **US-06** | Database Integrity | DBA | 250 | US-01 |
| **US-07** | Password Reset | Player | 220 | US-05 |
| **US-08** | Admin Management | Admin | 180 | US-05 |
| **US-09** | Visual Design | Admin / Player | 160 | None |

---

## Detailed Requirements

### US-01: Platform Management
**Story:** As a **Site Administrator**, I want to manage user accounts and roles to ensure the platform is secure and every user has the correct permissions.

**Acceptance Criteria:**
* The system must allow creating, blocking, or deleting user accounts.
* Administrators can assign roles such as **Player** or **Tournament Organizer**.
* A dashboard view is provided to monitor all registered users.

**Priority:** 100 (Critical)
**Dependency:** None

---

### US-02: Profile and Participation
**Story:** As a **Player**, I want to create my profile and register for tournaments to compete and let others see my progress.

**Acceptance Criteria:**
* Users can set up a profile with a **Nickname** and **Favorite Game**.
* A "Tournaments" section displays all events with an "Open" status.
* Upon registration, the player gains access to a personal match schedule.

**Priority:** 200 (High)
**Dependency:** US-01

---

### US-03: Competition Control
**Story:** As an **Organizer**, I want to create tournaments and record results so that the competition progresses automatically and orderly.

**Acceptance Criteria:**
* Organizers can create events by defining Name, Date, Game, and Prizes.
* The system supports bracket generation (manual or automatic) based on registered players.
* Results can be updated per match to advance winners to the next stage.

**Priority:** 300 (High)
**Dependency:** US-02

---

### US-04: Visualization and Results
**Story:** As a **User or Visitor**, I want to consult standings and statistics to stay informed about the best players and results.

**Acceptance Criteria:**
* Tournament brackets are publicly accessible for both live and past events.
* A search feature allows users to find player profiles and view win/loss ratios.
* Public data is viewable without requiring an active login session.

**Priority:** 400 (Medium)
**Dependency:** US-03

---

### US-05: Authentication and Security
**Story:** As a **System Administrator**, I want the platform to enforce JWT-based authentication so that all API endpoints are protected from unauthorized access.

**Acceptance Criteria:**
* The system must issue a signed JWT token upon successful login and registration.
* All protected API endpoints must validate the JWT token on every request using middleware.
* Admin-only endpoints must reject requests from non-admin roles with a 403 response.
* Database credentials and JWT secret must be stored in environment variables (`.env`).

**Priority:** 150 (Critical)
**Dependency:** US-01

---

### US-06: Database Integrity
**Story:** As a **Database Administrator**, I want FOREIGN KEY constraints enforced on all table relationships so that referential integrity is guaranteed at the database level.

**Acceptance Criteria:**
* All foreign key columns in TOURNAMENTS, REGISTRATION, MATCHES, and ACTIVITY must have explicit FK constraints.
* The USERS table must use `role_id INT` with a foreign key to the ROLES table.
* The schema definition in `01_schema_tables.sql` must match the actual running database.

**Priority:** 250 (High)
**Dependency:** US-01

---

### US-07: Password Reset
**Story:** As a **Player**, I want to reset my password via email so that I can regain access to my account if I forget my credentials.

**Acceptance Criteria:**
* The system must provide a "Forgot Password" page accessible from the login screen.
* Users must be able to enter their email address to request a reset link.
* The system must send an email with a secure, time-limited reset link (1-hour expiry).
* The reset link must direct the user to a page where they can set a new password.
* The token must be single-use and invalidated after a successful password change.
* The system must not reveal whether an email address is registered (returns a generic success message).

**Priority:** 220 (High)
**Dependency:** US-05

---

### US-08: Admin Management
**Story:** As an **Administrator**, I want to create, view, and demote other admin accounts so that I can control who has administrative access to the platform.

**Acceptance Criteria:**
* An authenticated admin must be able to create a new admin account by providing username, email, and password.
* The admin panel must display a list of all current admin users.
* An admin must be able to demote another admin to a regular player role.
* The system must prevent an admin from demoting their own account.
* All admin management actions must be logged in the activity feed.

**Priority:** 180 (High)
**Dependency:** US-05

---

### US-09: Visual Redesign
**Story:** As a **User or Administrator**, I want the platform to have a modern gaming-themed visual design so that the experience feels immersive and professional.

**Acceptance Criteria:**
* The UI must use a dark gaming-oriented color palette (Cyber Neon theme).
* The background must feature an animated particle effect related to video gaming.
* Colors must be consistent across all pages and components.
* The design must include neon accents, glow effects, and smooth transitions.
* The animated background must not interfere with UI usability or performance.

**Priority:** 160 (Medium)
**Dependency:** None
