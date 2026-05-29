# Sprint Backlog — Sprint 3

## eSports Tournament Database System

---

# Sprint Goal

The objective of this sprint was to implement tournament registration functionality, stabilize frontend and backend integration, fix critical routing and database issues, and develop an administrative statistics dashboard with dynamic visualizations.

---

# Sprint Duration

| Start Date     | End Date     | Duration |
| -------------- | ------------ | -------- |
| April 22, 2026 | May 05, 2026 | 2 Weeks  |

---

# Time Estimation

| Total Estimated Hours | Total Story Points |
| --------------------- | ------------------ |
| 70 Hours              | 67 SP              |

---

# User Stories

## US-01

As a player, I want to register for tournaments so that I can participate in competitions.

## US-02

As an administrator, I want to visualize tournament statistics so that I can monitor platform activity.

## US-03

As a user, I want game images and tournament information to load correctly so that I can navigate the system without issues.

## US-04

As an administrator, I want stable backend endpoints so that frontend services communicate correctly with the API.

## US-05

As a developer, I want better validation and error handling so that system failures are minimized.

---

# Sprint Tasks

| ID    | Task                                                | Priority | Responsible | Status      |
| ----- | --------------------------------------------------- | -------- | ----------- | ----------- |
| SB-01 | Implement tournament registration system            | High     | Emmanuel    | Done        |
| SB-02 | Create backend endpoint for tournament registration | High     | Emmanuel    | Done        |
| SB-03 | Develop autocomplete search component               | Medium   | Citlalli    | Done        |
| SB-04 | Create `/api/games` endpoint                        | High     | Caleb       | Done        |
| SB-05 | Configure static image serving                      | Medium   | Angel       | Done        |
| SB-06 | Implement statistics dashboard                      | High     | Emmanuel    | Done        |
| SB-07 | Integrate Chart.js dynamic charts                   | Medium   | Dilan       | Done        |
| SB-08 | Standardize API route structure                     | Critical | Caleb       | Done        |
| SB-09 | Improve login error handling                        | Medium   | Dilan       | Done        |
| SB-10 | Fix MySQL NULL validation issue                     | High     | Angel       | Done        |
| SB-11 | Fix missing exports in services                     | Medium   | Citlalli    | Done        |
| SB-12 | Implement tournament status management              | Medium   | Team        | In Progress |
| SB-13 | Develop advanced analytics                          | Low      | Team        | In Progress |

---

# Activity Time Estimation

| Task                                  | Estimated Time |
| ------------------------------------- | -------------- |
| Tournament registration functionality | 12 Hours       |
| Backend endpoint development          | 8 Hours        |
| Autocomplete component                | 5 Hours        |
| Games API endpoint                    | 4 Hours        |
| Static file configuration             | 3 Hours        |
| Statistics dashboard                  | 10 Hours       |
| Chart.js integration                  | 6 Hours        |
| API route standardization             | 5 Hours        |
| Error handling improvements           | 4 Hours        |
| Database validation fixes             | 5 Hours        |
| Service refactoring                   | 4 Hours        |
| Tournament status management          | 6 Hours        |
| Advanced analytics development        | 6 Hours        |

---

# Dependencies and Impediments

## Dependencies

* Backend API availability before frontend integration
* MySQL database connection stability
* Correct REST API route configuration
* Chart.js integration depending on backend statistics endpoints

---

## Impediments

| Impediment                            | Impact | Solution                         |
| ------------------------------------- | ------ | -------------------------------- |
| Incorrect API routes                  | High   | Standardized backend routes      |
| Missing backend endpoints             | High   | Implemented missing API services |
| Static images not loading             | Medium | Fixed static file configuration  |
| MySQL NULL insertion errors           | High   | Added validation rules           |
| Frontend/backend communication issues | High   | Improved service architecture    |
| Missing service exports               | Medium | Refactored service layer         |

---

# Definition of Done (DoD)

A task is considered completed when:

* Feature implementation is fully functional
* Frontend and backend integration works correctly
* Database operations are validated successfully
* No critical console or server errors exist
* API endpoints respond correctly
* UI functionality is tested manually
* Code is pushed to the repository
* Changes are documented properly
* Responsive design is verified
* System flow works without blocking issues

---

# Sprint Results

## Completed Features

* Tournament registration system
* Tournament autocomplete search
* Games API endpoint
* Static image serving
* Admin statistics dashboard
* Dynamic charts using Chart.js
* API route standardization
* Improved error handling

---

# Current System Flow

```txt
Register → Login → View Games → Join Tournament → Admin Dashboard
```

---

# Sprint Conclusion

Sprint 3 successfully stabilized the tournament management system and achieved full frontend, backend, and database integration for core functionalities.

Critical routing, validation, and visualization issues were resolved while preparing the platform for future analytics and scalability improvements.

---
