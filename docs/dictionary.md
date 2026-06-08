# Data Dictionary - eSports Tournament System (Relational)

This document describes the structure, data types, and constraints for the MySQL database.

---

## Table: USERS

Stores account data for administrators and players.

| Field         | Type         | Constraint              | Description                              |
| :------------ | :----------- | :---------------------- | :--------------------------------------- |
| **id**        | INT          | PK, Auto-increment      | Unique identifier for each user.         |
| **username**  | VARCHAR(50)  | Not Null, Unique        | Unique name for system login.            |
| **email**     | VARCHAR(100) | Not Null, Unique        | User's electronic mail address.          |
| **password**  | VARCHAR(255) | Not Null                | Hashed security credentials.             |
| **role_id**   | INT          | FK (ROLES.id), Not Null | Role assigned to the user.               |
| **nickname**  | VARCHAR(50)  | Not Null                | In-game name displayed in tournaments.   |
| **is_active** | BOOLEAN      | Not Null                | Indicates if the user account is active. |

---

## Table: GAMES

Stores master data of supported esports titles.

| Field            | Type         | Constraint         | Description                                   |
| :--------------- | :----------- | :----------------- | :-------------------------------------------- |
| **id**           | INT          | PK, Auto-increment | Unique identifier for each game.              |
| **game_name**    | VARCHAR(100) | Not Null, Unique   | Official title of the game.                   |
| **genre**        | VARCHAR(50)  | Not Null           | Game category (e.g., FPS, MOBA).              |
| **publisher**    | VARCHAR(100) | Nullable           | Company that publishes the game.              |
| **release_date** | DATE         | Nullable           | Official launch date.                         |
| **is_active**    | BOOLEAN      | Not Null           | Indicates if the game is currently supported. |

---

## Table: TOURNAMENTS

Stores competition details managed by an administrator.

| Field          | Type          | Constraint              | Description                               |
| :------------- | :------------ | :---------------------- | :---------------------------------------- |
| **id**         | INT           | PK, Auto-increment      | Unique identifier for the tournament.     |
| **name**       | VARCHAR(100)  | Not Null                | Official name of the event.               |
| **game_id**    | INT           | FK (GAMES.id), Not Null | Game associated with the tournament.      |
| **prize_pool** | DECIMAL(12,2) | Not Null                | Total monetary prize amount.              |
| **start_date** | DATETIME      | Not Null                | Scheduled start time.                     |
| **status_id**  | INT           | FK → STATUS.id          | Current state of the tournament.          |
| **creator_id** | INT           | FK (USERS.id), Not Null | Administrator who created the tournament. |
| **is_active**  | BOOLEAN       | Not Null                | Indicates if the tournament is available. |

---

## Table: REGISTRATION

Associative table for the Many-to-Many relationship between Users and Tournaments.

| Field                 | Type     | Constraint                    | Description                        |
| :-------------------- | :------- | :---------------------------- | :--------------------------------- |
| **id**                | INT      | PK, Auto-increment            | Registration record identifier.    |
| **user_id**           | INT      | FK (USERS.id), Not Null       | ID of the player signing up.       |
| **tournament_id**     | INT      | FK (TOURNAMENTS.id), Not Null | ID of the tournament being joined. |
| **registration_date** | DATETIME | Not Null                      | Date and time of enrollment.       |

### Additional Constraint

| Constraint                         | Description                                                             |
| ---------------------------------- | ----------------------------------------------------------------------- |
| **UNIQUE(user_id, tournament_id)** | Prevents a user from registering more than once in the same tournament. |

---

## Table: MATCHES

Stores the competitive encounters and their results within a specific tournament.

| Field             | Type        | Constraint                    | Description                                                        |
| :---------------- | :---------- | :---------------------------- | :----------------------------------------------------------------- |
| **id**            | INT         | PK, Auto-increment            | Match identifier.                                                  |
| **tournament_id** | INT         | FK (TOURNAMENTS.id), Not Null | Tournament this match belongs to.                                  |
| **player_1_id**   | INT         | FK (USERS.id), Not Null       | ID of the first participant.                                       |
| **player_2_id**   | INT         | FK (USERS.id), Not Null       | ID of the second participant.                                      |
| **winner_id**     | INT         | FK (USERS.id), Nullable       | ID of the player who won the match.                                |
| **round**         | VARCHAR(50) | Not Null                      | Tournament stage (e.g., 'Quarter-finals', 'Semi-finals', 'Final'). |

---

## Table: ACTIVITY

Stores system event logs such as new users, new tournaments, added games, registrations, and match results.

| Field             | Type         | Constraint                          | Description                                                                    |
| :---------------- | :----------- | :---------------------------------- | :----------------------------------------------------------------------------- |
| **id**            | INT          | PK, Auto-increment                  | Unique identifier for each activity record.                                    |
| **user_id**       | INT          | FK (USERS.id), Nullable             | User who performed the action.                                                 |
| **tournament_id** | INT          | FK (TOURNAMENTS.id), Nullable       | Related tournament, if applicable.                                             |
| **game_id**       | INT          | FK (GAMES.id), Nullable             | Related game, if applicable.                                                   |
| **match_id**      | INT          | FK (MATCHES.id), Nullable           | Related match, if applicable.                                                  |
| **action_type**   | VARCHAR(50)  | Not Null                            | Type of action (e.g., CREATE_USER, CREATE_TOURNAMENT, REGISTER, CREATE_MATCH, NEW_ADMIN, ADMIN_DEMOTED, PASSWORD_RESET_REQUESTED, PASSWORD_RESET_COMPLETED). |
| **description**   | VARCHAR(255) | Not Null                            | Human-readable message displayed in the frontend.                              |
| **created_at**    | DATETIME     | Not Null, Default CURRENT_TIMESTAMP | Date and time when the activity occurred.                                      |

---

## Table: PASSWORD_RESETS

Stores password reset tokens generated for users who request a password reset.

| Field          | Type         | Constraint              | Description                                                 |
| :------------- | :----------- | :---------------------- | :---------------------------------------------------------- |
| **id**         | INT          | PK, Auto-increment      | Unique identifier for the reset record.                     |
| **user_id**    | INT          | FK (USERS.id), Not Null | User who requested the password reset.                      |
| **token**      | VARCHAR(255) | Not Null                | Cryptographically secure reset token (64 hex characters).   |
| **expires_at** | DATETIME     | Not Null                | Date and time when the token expires (1 hour from creation).|
| **used_at**    | DATETIME     | Nullable                | Date and time when the token was used (null if still valid).|
| **created_at** | DATETIME     | Default CURRENT_TIMESTAMP | Date and time when the record was created.                |

### Additional Constraint

| Constraint                    | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| **FOREIGN KEY (user_id)**     | Ensures referential integrity with the USERS table.|

---

## Table: STATUS

Stores the possible status values that can be assigned to tournaments.

| Field           | Type         | Constraint                   | Description                         |
| --------------- | ------------ | ---------------------------- | ----------------------------------- |
| **id**          | INT          | PK, Auto-increment, Not Null | Current state of the tournament.    |
| **name**        | VARCHAR(50)  | UNIQUE, NOT NULL             | Name of the tournament status.      |
| **description** | VARCHAR(255) | NULL                         | Optional description of the status. |

---

### Table: ROLES

| Field       | Type         | Constraints        | Description                                                          |
| ----------- | ------------ | ------------------ | -------------------------------------------------------------------- |
| id          | INT          | PK, AUTO_INCREMENT | Unique identifier for each role in the system.                       |
| role_name   | VARCHAR(50)  | NOT NULL, UNIQUE   | Name of the role assigned to users (e.g., admin, player, organizer). |
| description | VARCHAR(255) | NULL               | Brief explanation of the role and its permissions within the system. |
| is_active   | BOOLEAN      | DEFAULT TRUE       | Indicates whether the role is currently active in the system.        |

---

## Entity Relationship Summary

The following table summarizes the main relationships between entities in the database.

| Parent Table | Child Table    | Relationship | Description                                                                                                                                                   |
| ------------ | -------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ROLES        | USERS          | 1 : N        | A role can be assigned to many users.                                                                                                                         |
| STATUS       | TOURNAMENTS    | 1 : N        | A status can be applied to multiple tournaments.                                                                                                              |
| GAMES        | TOURNAMENTS    | 1 : N        | A game can have multiple tournaments associated with it.                                                                                                      |
| USERS        | REGISTRATION   | 1 : N        | A user can register for multiple tournaments.                                                                                                                 |
| USERS        | PASSWORD_RESETS| 1 : N        | A user can request multiple password resets.                                                                                                                  |
| TOURNAMENTS  | REGISTRATION   | 1 : N        | A tournament can accept multiple player registrations.                                                                                                        |
| USERS        | TOURNAMENTS    | N : M        | A user can participate in multiple tournaments and a tournament can have multiple users. This relationship is implemented through the **REGISTRATION** table. |
| TOURNAMENTS  | MATCHES        | 1 : N        | A tournament organizes multiple matches.                                                                                                                      |
| USERS        | MATCHES        | 1 : N        | Users participate in matches as players.                                                                                                                      |
| MATCHES      | ACTIVITY       | 1 : N        | Matches may generate activity records.                                                                                                                        |
| GAMES        | ACTIVITY       | 1 : N        | Games may be referenced in activity logs.                                                                                                                     |
| TOURNAMENTS  | ACTIVITY       | 1 : N        | Tournament events may generate activity records.                                                                                                              |
