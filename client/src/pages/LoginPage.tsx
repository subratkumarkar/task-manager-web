import { useState } from "react";
import { api } from "../api/http";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            navigate("/tasks");
        } catch (err) {
            setError("Invalid email or password");
        }
    }

    return (
        <div className="fullscreen-center">
            <div className="auth-card">
                <h2 className="text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input type="email" value={email}
                           onChange={(e) => setEmail(e.target.value)} />
                    <label>Password</label>
                    <input type="password" value={password}
                           onChange={(e) => setPassword(e.target.value)} />
                    {error && (
                        <p className="error-text">{error}</p>
                    )}
                    <button type="submit" style={{ width: "100%", marginTop: "10px" }}>
                        Login
                    </button>
                </form>
                <p style={{ marginTop: "12px", textAlign: "center" }}>
                    <span className="link" onClick={() => navigate("/")}>
                     ← Back to Home
                </span>
                </p>
            </div>
        </div>
    );
}
