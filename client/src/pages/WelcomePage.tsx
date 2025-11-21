import "../styles.css";
import taskImg from "../assets/task.png";

export default function WelcomePage() {
    return (
        <div className="welcome-container">

            <img src={taskImg} className="welcome-image" alt="Task Manager" />

            <div className="welcome-text">
                <h1>Welcome to Task Manager</h1>
                <p>
                    Your personal productivity command center. Create tasks, prioritize
                    them, track progress, review history, and stay fully organized — all
                    in one beautifully simple workspace.
                </p>

                <div className="welcome-buttons">
                    <button onClick={() => (window.location.href = "/login")}>Login</button>
                    <button onClick={() => (window.location.href = "/signup")}>Create Account</button>
                </div>
            </div>

        </div>
    );
}