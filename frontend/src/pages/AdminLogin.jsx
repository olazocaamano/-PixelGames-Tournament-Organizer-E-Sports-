/*
    File: AdminLogin.jsx
    Description: Admin authentication page.
    Allows login and verifies if the user has admin permissions.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/userService";

import "../App.css";

function AdminLogin() {
    const navigate = useNavigate();

    // Form state
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginMessage, setLoginMessage] = useState("");

    /*
        Handle admin login authentication
        Sends credentials to API and validates user role
     */
    const handleAdminLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser({ username, password });

            // Extract user role from API response
            const role = response.data.user.role_name;

            if (role === "admin") {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.user.id);
                localStorage.setItem("role", role);
                navigate("/admin");
            } else {
                setLoginMessage("Access denied. You are not an admin.");
            }
        } catch {
            setLoginMessage("Invalid credentials");
        }
    };

    /*
        Clear session and return to home page
     */
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        navigate("/");
    };

    return (
        <div className="con-admin">
            {/* Page title */}
            <h2>Admin Login</h2>

            {/* Login form */}
            <form onSubmit={handleAdminLogin}>
                
                {/* Username input */}
                <input
                    type="text"
                    placeholder="Username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                {/* Password input */}
                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br />

                {/* Submit login */}
                <button type="submit">Login</button>

                {/* Return to home */}
                <div className="box-adminLogin-logout">
                    <button onClick={handleLogout} className="logout">
                        Home
                    </button>
                </div>

                {/* Login status message */}
                <p>{loginMessage}</p>
            </form>
        </div>
    );
}

export default AdminLogin;