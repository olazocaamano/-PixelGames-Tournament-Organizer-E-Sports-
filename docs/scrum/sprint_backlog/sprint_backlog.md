# Sprint Backlog — Sprint 1

## Database Foundation & Documentation

---

# Sprint Goal

Build the foundational database structure, improve normalization, define entity relationships, and establish project documentation standards.

---

# Sprint Duration

| Start Date     | End Date       | Duration |
| -------------- | -------------- | -------- |
| March 10, 2026 | March 24, 2026 | 2 Weeks  |

---

# Time Estimation

| Total Estimated Hours | Story Points |
| --------------------- | ------------ |
| 72 Hours              | 55 SP        |

---

# User Stories

### US-01

As a database administrator, I want a normalized database structure so that data consistency is maintained.

### US-02

As a developer, I want clearly defined relationships so that application logic can be implemented correctly.

### US-03

As a project member, I want technical documentation so that project changes are traceable.

### US-04

As an administrator, I want role and status management tables so that permissions and tournament states can be managed efficiently.

---

# Tasks

| ID    | Task                                           |
| ----- | ---------------------------------------------- |
| SB-01 | Create CHANGELOG documentation                 |
| SB-02 | Add Component Version Variation Dictionary     |
| SB-03 | Correct database table structure               |
| SB-04 | Add UNIQUE constraints                         |
| SB-05 | Correct foreign key references                 |
| SB-06 | Improve Data Dictionary descriptions           |
| SB-07 | Implement STATUS table                         |
| SB-08 | Implement ROLES table                          |
| SB-09 | Update relationship naming conventions         |
| SB-10 | Add Entity Relationship Summary                |
| SB-11 | Create DDL SQL schema                          |
| SB-12 | Validate Data Dictionary against SQL structure |

---

# Activity Time Estimation

| Activity               | Hours |
| ---------------------- | ----- |
| Documentation creation | 10    |
| Database corrections   | 12    |
| STATUS implementation  | 8     |
| ROLES implementation   | 8     |
| Relationship updates   | 6     |
| SQL DDL implementation | 14    |
| Data validation        | 8     |
| Final review           | 6     |

---

# Dependencies & Impediments

## Dependencies

* Approved ER Diagram
* Data Dictionary
* MySQL environment

## Impediments

| Issue                           | Impact | Resolution                      |
| ------------------------------- | ------ | ------------------------------- |
| Inconsistent relationship names | Medium | Standardized naming             |
| ENUM limitations                | High   | Replaced with relational tables |
| Missing documentation           | Medium | Added CHANGELOG and summaries   |

---

# Definition of Done (DoD)

* Database schema created
* Tables validated
* Foreign keys implemented
* Documentation updated
* Relationships documented
* SQL scripts tested successfully
* Version control documentation completed

---

# Sprint Backlog — Sprint 2

## Frontend Architecture, Player Management & Security

---

# Sprint Goal

Improve frontend maintainability, implement player visualization features, and strengthen authentication security.

---

# Sprint Duration

| Start Date     | End Date       | Duration |
| -------------- | -------------- | -------- |
| April 05, 2026 | April 08, 2026 | 4 Days   |

---

# Time Estimation

| Total Estimated Hours | Story Points |
| --------------------- | ------------ |
| 64 Hours              | 48 SP        |

---

# User Stories

### US-01

As an administrator, I want to view registered players so that I can manage users effectively.

### US-02

As a developer, I want a modular frontend structure so that future development becomes easier.

### US-03

As a user, I want secure authentication so that my account is protected.

### US-04

As an administrator, I want accurate role validation so that users access only authorized features.

---

# Tasks

| ID    | Task                                     |
| ----- | ---------------------------------------- |
| SB-01 | Implement player visualization module    |
| SB-02 | Create player retrieval endpoint         |
| SB-03 | Refactor frontend architecture           |
| SB-04 | Separate pages and components            |
| SB-05 | Centralize API services                  |
| SB-06 | Organize utility functions               |
| SB-07 | Implement bcrypt password encryption     |
| SB-08 | Improve login authentication             |
| SB-09 | Add duplicate account validation         |
| SB-10 | Improve backend error handling           |
| SB-11 | Connect backend errors with frontend UI  |
| SB-12 | Fix role validation logic                |
| SB-13 | Implement INNER JOIN for USERS and ROLES |

---

# Activity Time Estimation

| Activity                    | Hours |
| --------------------------- | ----- |
| Frontend refactoring        | 16    |
| Player visualization        | 8     |
| API endpoint implementation | 6     |
| Authentication improvements | 10    |
| Password encryption         | 8     |
| Error handling improvements | 6     |
| Role validation fixes       | 5     |
| Testing and debugging       | 5     |

---

# Dependencies & Impediments

## Dependencies

* Existing database schema
* ROLES table implementation
* React application structure

## Impediments

| Issue                       | Impact   | Resolution                     |
| --------------------------- | -------- | ------------------------------ |
| Plain text password storage | Critical | Implemented bcrypt             |
| Poor frontend scalability   | High     | Refactored architecture        |
| Incorrect role validation   | High     | Updated authentication queries |
| Weak user feedback          | Medium   | Improved error messages        |

---

# Definition of Done (DoD)

* Authentication secured with bcrypt
* Player list displayed correctly
* Frontend architecture reorganized
* Services centralized
* Role validation tested
* Backend and frontend integrated
* Error handling verified
* All changes documented

---

# Sprint Backlog — Sprint 3

## Tournament Management, Registration & Statistics

---

# Sprint Goal

Implement tournament management features, tournament registration, backend integration, and administrative statistics dashboards.

---

# Sprint Duration

| Start Date     | End Date     | Duration |
| -------------- | ------------ | -------- |
| April 22, 2026 | May 05, 2026 | 2 Weeks  |

---

# Time Estimation

| Total Estimated Hours | Story Points |
| --------------------- | ------------ |
| 96 Hours              | 70 SP        |

---

# User Stories

### US-01

As a player, I want to register for tournaments so that I can participate in competitions.

### US-02

As an administrator, I want to monitor tournament statistics so that I can track platform activity.

### US-03

As a user, I want tournament information and game images to load correctly.

### US-04

As an administrator, I want stable API endpoints so that system integrations work properly.

---

# Tasks

| ID    | Task                                     |
| ----- | ---------------------------------------- |
| SB-01 | Implement tournament creation form       |
| SB-02 | Implement tournament list view           |
| SB-03 | Integrate frontend, backend and database |
| SB-04 | Create tournament registration system    |
| SB-05 | Implement autocomplete tournament search |
| SB-06 | Create tournament registration endpoint  |
| SB-07 | Create `/api/games` endpoint             |
| SB-08 | Configure static image serving           |
| SB-09 | Implement statistics dashboard           |
| SB-10 | Integrate Chart.js                       |
| SB-11 | Standardize API routes                   |
| SB-12 | Improve error handling                   |
| SB-13 | Fix login route                          |
| SB-14 | Fix image loading issues                 |
| SB-15 | Fix NULL value database issues           |
| SB-16 | Refactor tournament services             |
| SB-17 | Develop tournament status management     |
| SB-18 | Develop advanced analytics               |

---

# Activity Time Estimation

| Activity                    | Hours |
| --------------------------- | ----- |
| Tournament UI development   | 15    |
| Registration system         | 15    |
| API development             | 12    |
| Backend integration         | 10    |
| Statistics dashboard        | 12    |
| Chart.js integration        | 8     |
| Error handling improvements | 6     |
| Bug fixing                  | 8     |
| Analytics development       | 10    |

---

# Dependencies & Impediments

## Dependencies

* Stable backend API
* Database connectivity
* Chart.js library
* Authentication system

## Impediments

| Issue                                   | Impact | Resolution                     |
| --------------------------------------- | ------ | ------------------------------ |
| Missing API endpoints                   | High   | Added required endpoints       |
| Routing errors                          | High   | Standardized route structure   |
| Static file issues                      | Medium | Corrected server configuration |
| Database NULL values                    | High   | Added validations              |
| Frontend/backend communication failures | High   | Refactored services            |

---

# Definition of Done (DoD)

* Tournament registration operational
* Frontend, backend and database integrated
* Statistics dashboard functional
* API endpoints tested
* Critical bugs resolved
* Manual testing completed
* Documentation updated
* Core user flow operational

```txt
Register → Login → View Games → Join Tournament → Admin Dashboard
```

---
