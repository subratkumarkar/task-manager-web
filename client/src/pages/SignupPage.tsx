import { useState } from "react";
import { api } from "../api/http";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [signupError, setSignupError] = useState("");
    const [signupSuccess, setSignupSuccess] = useState("");
    const token = localStorage.getItem("token");

    function loginIfMissingToken() {
        if (token) {
            navigate("/tasks")
        } else {
            navigate("/login")
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await api.post("/auth/signup", {
                email,
                firstname,
                lastname,
                password,
            });
            setSignupSuccess("Account created successfully! Please log in.");
            setTimeout(() => navigate("/login"), 1200); // small delay so user can see message
        } catch (err) {
            const backendMsg = err.response?.data?.error ||  "Signup failed. Please try again.";
            setSignupError(backendMsg);
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

                    {signupError && (
                        <p className="error-text" style={{ textAlign: "center" }}>
                            {signupError}
                        </p>
                    )}

                    {signupSuccess && (
                        <p className="success-text" style={{ color: "green", textAlign: "center" }}>
                            {signupSuccess}
                        </p>
                    )}
                    <button type="submit" style={{ width: "100%", marginTop: "10px" }}>
                        Sign Up
                    </button>
                </form>

                <p className="text-center" style={{ marginTop: "15px" }}>
                    Already have an account? <a className="link" onClick={loginIfMissingToken}>Login</a>
                </p>
            </div>
        </div>
    );
}
