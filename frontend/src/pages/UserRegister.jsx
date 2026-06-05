/*
    File: UserRegister.jsx
    Description: User registration page.
    Allows new users to create an account and register into the system.
 */

import React, { useState } from "react";
import { registerUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

import "../App.css";

function UserRegister() {
    const navigate = useNavigate();

    // Form state
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    /*
        Handle user registration
        Sends user data to API and creates a new account
     */
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await registerUser({
                username,
                nickname,
                email,
                password,
                role: "user" // Default role for new accounts
            });

            setMessage(response.data.message);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("role", "player");
            localStorage.setItem("userId", response.data.user.id);

            navigate("/player");

        } catch (err) {
            // Handle API error messages
            setMessage(err.response?.data?.error || "Server error");
        }
    };

    return (
        <div id="con-user-register" className="con-user">

            {/* Page title */}
            <h2>User Registration</h2>

            {/* Registration form */}
            <form onSubmit={handleRegister}>

                {/* Username input */}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setMessage("");
                    }}
                />

                {/* Nickname input */}
                <input
                    type="text"
                    placeholder="Nickname"
                    value={nickname}
                    onChange={(e) => {
                        setNickname(e.target.value);
                        setMessage("");
                    }}
                />

                {/* Email input */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setMessage("");
                    }}
                />

                {/* Password input */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setMessage("");
                    }}
                />

                {/* Submit button */}
                <button type="submit">Register</button>

                {/* Response message */}
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default UserRegister;