/*
    File: TournamentAutocomplete.jsx
    Description: Advanced autocomplete component for tournament search and registration.
    Includes debounce search, keyboard navigation, click-outside handling and improved UX.
*/

import React, { useEffect, useState, useRef } from "react";
import { registerToTournament, searchTournaments } from "../services/tournamentService";

function TournamentAutocomplete({ onRegisterSuccess }) {

    const [user, setUser] = useState(null);

    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [selectedTournament, setSelectedTournament] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const containerRef = useRef(null);

    /* Load logged user from localStorage */
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    /* Close dropdown when clicking outside */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setResults([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* Fetch tournaments with debounce */
    useEffect(() => {
        const delay = setTimeout(async () => {

            if (!search.trim() || !user) {
                setResults([]);
                return;
            }

            try {
                const res = await searchTournaments(search, user.id);

                setResults(res.data);
                setSelectedIndex(-1);

            } catch (error) {
                console.error("Search error:", error);
            }

        }, 300);

        return () => clearTimeout(delay);

    }, [search, user]);

    /* Handle keyboard navigation */
    const handleKeyDown = (e) => {

        if (e.key === "ArrowDown") {
            setSelectedIndex(prev =>
                prev < results.length - 1 ? prev + 1 : prev
            );
        }

        if (e.key === "ArrowUp") {
            setSelectedIndex(prev =>
                prev > 0 ? prev - 1 : prev
            );
        }

        if (e.key === "Enter" && selectedIndex >= 0) {
            const selected = results[selectedIndex];

            setSelectedTournament(selected);
            setSearch(selected.name);
            setResults([]);
        }
    };

    /*
    Handles tournament registration request
*/
    const handleRegister = async () => {

        if (!selectedTournament) {
            setMessage("Select a tournament");
            return;
        }

        if (!user || !user.id) {
            setMessage("User not authenticated");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await registerToTournament({
                user_id: user.id,
                tournament_id: selectedTournament.id
            });

            setMessage(res.data.message || "Successfully joined tournament");

            if (onRegisterSuccess) {
                onRegisterSuccess();
            }

            // Reset selection after success
            setSelectedTournament(null);
            setSearch("");
            setResults([]);

        } catch (error) {
            console.log(error.response);
            setMessage(
                error.response?.data?.error || "Registration failed"
            );
        }

        setLoading(false);
    };

    /* Loading state */
    if (!user) {
        return <p>Loading user...</p>;
    }

    return (
        <div className="autocomplete-box" ref={containerRef}>

            <h2>Join Tournament</h2>

            {/* Search input */}
            <input
                type="text"
                placeholder="Search tournament (type at least 1 letter)..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedTournament(null);
                }}
                onKeyDown={handleKeyDown}
            />

            {/* Dropdown results */}
            {results.length > 0 && (
                <ul className="autocomplete-dropdown">
                    {results.map((t, index) => (
                        <li
                            key={t.id}
                            className={index === selectedIndex ? "active" : ""}
                            onClick={() => {
                                setSelectedTournament(t);
                                setSearch(t.name);
                                setResults([]);
                            }}
                        >
                            <strong>{t.name}</strong>
                            <span>${t.prize_pool}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Selected tournament */}
            {selectedTournament && (
                <div className="selected-tournament">
                    Selected: {selectedTournament.name}
                </div>
            )}

            <button onClick={handleRegister} disabled={loading || !selectedTournament}>
                {loading ? "Joining..." : "Join Tournament"}
            </button>

            {message && <p>{message}</p>}
        </div>
    );
}

export default TournamentAutocomplete;