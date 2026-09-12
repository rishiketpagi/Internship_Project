import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

function AuthLoading() {
    return (
        <div className="auth-loading" role="status">
            Checking your session...
        </div>
    );
}

export function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <AuthLoading />;
    }

    if (!user) {
        return <Navigate to="/signin" replace state={{ from: location }} />;
    }

    return children;
}
