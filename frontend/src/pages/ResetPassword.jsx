import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/userService";
import "../App.css";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await resetPassword(token, password);
            setMessage(res.data.message);
            setTimeout(() => navigate("/"), 2500);
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
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                    {message && (
                        <>
                            <p style={{ color: "#22c55e", textAlign: "center" }}>{message}</p>
                            <p style={{ color: "#94a3b8", textAlign: "center", fontSize: 13 }}>
                                Redirecting to login...
                            </p>
                        </>
                    )}
                    {error && <p style={{ color: "#ef4444", textAlign: "center" }}>{error}</p>}
                    <div className="register" style={{ textAlign: "center" }}>
                        <p><Link to="/">Back to Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
