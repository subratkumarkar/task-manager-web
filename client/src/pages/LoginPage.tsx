import { useState, useEffect } from "react";
import { api } from "../api/http";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const [params] = useSearchParams();

    // Redirect immediately if token already exists
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/tasks", { replace: true });
        }
    }, []);

    // Show session expired message
    useEffect(() => {
        const expired = params.get("session");
        if (expired === "expired") {
            setError("Your session has expired. Please log in again.");
        }
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            navigate("/tasks", { replace: true });
        } catch (err) {
            setError("Invalid email or password");
        }
    }

    return (
        <div className="fullscreen-center">
            <div className="auth-card">
                <h2 className="text-center">Login</h2>

                {error && <p className="error-text">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input type="email" value={email}
                           onChange={(e) => setEmail(e.target.value)} />

                    <label>Password</label>
                    <input type="password" value={password}
                           onChange={(e) => setPassword(e.target.value)} />

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
