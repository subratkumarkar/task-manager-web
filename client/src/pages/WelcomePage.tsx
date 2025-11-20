import "../styles.css";
import { useNavigate } from "react-router-dom";
import taskImg from "../assets/task.png";

export default function WelcomePage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    function handleLogin() {
        if (token) navigate("/tasks");
        else navigate("/login");
    }

    return (
        <div className="welcome-wrapper">
            <div className="welcome-left">
                <img
                    src={taskImg}
                    alt="Task Manager Illustration"
                    className="welcome-image"/>
            </div>

            <div className="welcome-right">
                <h1 className="welcome-title">Welcome to Task Manager</h1>
                <p className="welcome-text">
                    Your personal productivity command center. Create tasks,
                    prioritize them, track progress, review history, and stay fully
                    organized — all in one beautifully simple workspace.
                </p>

                <div className="welcome-buttons">
                    <button className="btn-primary" onClick={handleLogin}>
                        Login
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => navigate("/signup")} >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}
