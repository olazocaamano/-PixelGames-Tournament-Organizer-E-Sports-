/*
    File: Home.jsx
    Description: Main landing page of the platform.
    Includes user login, game carousel, and navigation links.
    Shows available games and provides access to player/admin sections.
 */

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import "../App.css";

import { loginUser } from "../services/userService";
import API from "../services/api";

function Home() {
    const navigate = useNavigate();

    // Login form state (player)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    // Games data (carousel)
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Current active slide in carousel
    const [currentSlide, setCurrentSlide] = useState(0);

    /*
        Handle player login
        Validates credentials and redirects only if role is "player"
     */
    const handleUserLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser({ username, password });
            const role = response.data.user.role_name;

            console.log("LOGIN RESPONSE:", response.data);

            if (role === "player") {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("role", role);
                localStorage.setItem("userId", response.data.user.id);
                navigate("/player");
            } else {
                setMessage("Access denied. You are not a player.");
            }
        } catch {
            setMessage("Invalid credentials");
        }
    };

    /*
        Fetch available games for carousel display
     */
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await API.get("/games?active=1");

                console.log("GAMES:", response.data);
                setGames(response.data);
            } catch (err) {
                console.error("ERROR LOADING GAMES:", err);
                setError("Failed to load games");
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    /*
        Auto-slide carousel every 4 seconds
     */
    useEffect(() => {
        if (games.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) =>
                prev === games.length - 1 ? 0 : prev + 1
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [games]);

    return (
        <div className="window">

            {/* Page title */}
            <h1>TOE | The platform for gamers</h1>

            <div className="content">
                <div className="right-panel">

                    <div className="container">
                        <div className="container-center">

                            {/* Games carousel section */}
                            <div className="carrousel">
                                <div className="carrousel-slide">

                                    {/* Slide container with transform animation */}
                                    <div
                                        className="carrousel-inner"
                                        style={{
                                            transform: `translateX(-${currentSlide * 100}%)`
                                        }}
                                    >
                                        {games.map((game) => (
                                            <div key={game.id} className="carrousel-item">

                                                {/* Game image */}
                                                <img
                                                    className="d-block w-100"
                                                    src={`http://localhost:5000${game.image_url}`}
                                                    alt={game.game_name}
                                                />

                                                {/* Game information */}
                                                <div className="slide-info">
                                                    <h1>{game.game_name}</h1>
                                                    <hr className="line-decorative" />
                                                    <p>{game.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Carousel indicators */}
                                    <div className="carrousel-indicators">
                                        {games.map((_, index) => (
                                            <span
                                                key={index}
                                                className={
                                                    index === currentSlide ? "dot active" : "dot"
                                                }
                                                onClick={() => setCurrentSlide(index)}
                                            ></span>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Player login section */}
                        <div className="con-user">
                            <h2>User Login</h2>

                            <form onSubmit={handleUserLogin}>

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

                                {/* Password recovery link */}
                                <div className="resetPass">
                                    <p>
                                        Forgot your password?{" "}
                                        <Link to="/reset">Reset</Link>
                                    </p>
                                </div>

                                {/* Submit login */}
                                <button type="submit">Login</button>

                                {/* Registration link */}
                                <div className="register">
                                    <p>
                                        Don't have an account?{" "}
                                        <Link to="/user/register">Register</Link>
                                    </p>
                                </div>

                                {/* Login message */}
                                <p>{message}</p>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;