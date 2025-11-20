import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem("token");

    // If no token → redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
