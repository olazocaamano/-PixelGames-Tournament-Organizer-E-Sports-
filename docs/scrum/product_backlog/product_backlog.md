# Product Backlog

## Product Goal
To provide a comprehensive and seamless e-sports tournament management platform (PixelGames) where administrators can efficiently organize events, track statistics, and manage participants, while players can easily discover and register for upcoming competitive events.

---

## Epic 1: Administrator Dashboard & Tournament Control
**Description:** As an administrator, I need a centralized control panel to manage the lifecycle of e-sports tournaments, view system statistics, and monitor general platform activity.

### User Story 1.1
As an administrator, I want to create a new tournament so that players have new competitions to register for.
* **Acceptance Criteria:**
    * **Given** the administrator is logged in and on the Tournament Control section
    * **When** they fill out the "Create Tournament" form with valid details (name, game ID, prize pool, start date) and select an initial status
    * **Then** the system should successfully save the tournament to the database ensuring the status is linked via its proper foreign key
    * **And** a success alert should be displayed to the user
    * **And** the active tournaments list should refresh automatically to include the new entry.

### User Story 1.2
As an administrator, I want to view a visual summary of the platform's statistics so that I can easily understand the current volume of active tournaments and registered players.
* **Acceptance Criteria:**
    * **Given** the administrator accesses the Statistics section of the dashboard
    * **When** the page loads the required data from the API
    * **Then** a bar chart must render showing the total, active, and finished tournaments alongside total players and average prize pool
    * **And** the chart tooltips must display the exact numeric values when hovered over.

---

## Epic 2: Player Database Management
**Description:** As an administrator, I need specific tools to query and manage the user base, ensuring I am only interacting with relevant participant accounts.

### User Story 2.1
As an administrator, I want to view a paginated list of all users with the "player" role (Role 3) so that I can efficiently manage the competitor database without loading unnecessary admin or staff accounts.
* **Acceptance Criteria:**
    * **Given** the administrator navigates to the Players Control section
    * **When** the component fetches the user data from the API
    * **Then** the system must display only users assigned to role ID 3 in a tabular format
    * **And** the table must include the player's status indicator, identity (nickname/username), email, and action buttons
    * **And** the results must be paginated, displaying a maximum of 20 players per page.

### User Story 2.2
As an administrator, I want to search for specific players by their nickname so that I can quickly locate their profile and manage their account.
* **Acceptance Criteria:**
    * **Given** the administrator is viewing the Players List
    * **When** they enter a specific nickname into the search bar and press Enter or click the Search button
    * **Then** the pagination must reset to page 1
    * **And** the table must display only the players matching the inputted search term.

---

## Epic 3: Player Tournament Discovery & Registration
**Description:** As a registered player, I need an intuitive way to find available tournaments for my favorite games and securely sign up for them.

### User Story 3.1
As a player, I want to search for active tournaments using an autocomplete text field so that I can quickly find a competition without having to scroll through long lists.
* **Acceptance Criteria:**
    * **Given** the player is on the Tournament Registration view
    * **When** they type at least one letter into the search input
    * **Then** the system must wait for a brief delay (debounce) before querying the database
    * **And** a dropdown list of matching active tournaments (displaying name and prize pool) must appear below the input field.

### User Story 3.2
As a player, I want to join a tournament I have selected from the search results so that I am officially registered as a participant.
* **Acceptance Criteria:**
    * **Given** the player has selected a specific tournament from the autocomplete dropdown
    * **When** they click the "Join Tournament" button
    * **Then** the system must send a registration request to the backend linking the player's ID to the selected tournament's ID
    * **And** upon success, a confirmation message must be displayed on the screen
    * **And** the search input and selected tournament state must reset.