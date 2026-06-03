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
