import { useNavigate } from "react-router-dom";

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
                        <button
                            className="header-link"
                            onClick={() => navigate(`/activities`)}
                        >
                            📊 User Activity
                        </button>

                        <button className="header-link logout-link" onClick={logout}>
                            🔓 Logout
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
