import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/userService";
import "../App.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const res = await forgotPassword(email);
            setMessage(res.data.message);
            if (res.data.previewUrl) {
                setMessage(prev => prev + " (Preview: " + res.data.previewUrl + ")");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            position: "relative",
            marginTop: 170,
            zIndex: 1,
        }}>
            <div className="con-admin" style={{ marginTop: 0, height: "auto", minHeight: 380 }}>
                <h2>Forgot Password</h2>
                <p style={{ color: "#94a3b8", textAlign: "center", marginBottom: 20, fontSize: 14 }}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                    <div className="register" style={{ textAlign: "center" }}>
                        <p>
                            <Link to="/">Back to Login</Link>
                        </p>
                    </div>
                    {message && <p style={{ color: "#22c55e", textAlign: "center" }}>{message}</p>}
                    {error && <p style={{ color: "#ef4444", textAlign: "center" }}>{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
