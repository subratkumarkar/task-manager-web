import { BrowserRouter, Routes, Route } from "react-router-dom";

import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TaskDashboard from "./pages/TaskDashboard";
import UserActivityPage from "./pages/UserActivityPage";
import AppHeader from "./components/AppHeader";

export default function App() {
    return (
        <BrowserRouter>
            <AppHeader />

            <Routes>
                {/* Public */}
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Private */}
                <Route path="/tasks" element={<TaskDashboard />} />
                <Route path="/activities" element={<UserActivityPage />} />
            </Routes>
        </BrowserRouter>
    );
}
