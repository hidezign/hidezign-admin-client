// components/ProtectedRoute.tsx
import { Navigate } from "react-router";
import { ReactNode } from "react";

interface ProtectedRoutesProps {
    token: string | null;
    role: string | null;
    children: ReactNode;
}

export default function ProtectedRoutes({
    token,
    role,
    children,
}: ProtectedRoutesProps) {
    if (!token || role !== "admin") {
        return <Navigate to="/signin" replace />;
    }
    return <>{children}</>;
}
