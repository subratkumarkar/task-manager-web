import { useState } from "react";
import { api } from "../api/http";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await api.post("/auth/signup", {
                email,
                firstname,
                lastname,
                password,
            });
            alert("Account created successfully! Please log in.");
            navigate("/login");
        } catch (err) {
            alert("Signup failed");
        }
    }

    return (
        <div className="flex-center" style={{ minHeight: "100vh" }}>
            <div className="form-card">
                <h2 className="text-center">Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <label>First Name</label>
                    <input
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        placeholder="Enter first name"/>

                    <label>Last Name</label>
                    <input
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        placeholder="Enter last name"/>

                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"/>

                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"/>

                    <button type="submit" style={{ width: "100%", marginTop: "10px" }}>
                        Sign Up
                    </button>
                </form>

                <p className="text-center" style={{ marginTop: "15px" }}>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
}
