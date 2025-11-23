import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function AppHeader() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    function goHome() {
        navigate("/");
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
    }

    return (
        <header className="app-header">
            <div className="app-header-left" onClick={goHome}>
                <h2 className="app-logo">🏠 Task Manager</h2>
            </div>

            <div className="app-header-right">
                {token && (
                    <>
                        <Link to="/activities" className="header-link">
                            📊 User Activity
                        </Link>
                        <Link to="/login" className="logout-link"
                              onClick={logout}>
                            🔓 Logout
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
