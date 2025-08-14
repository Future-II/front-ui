// src/shared/components/AuthGuard.tsx
import { Navigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: JSX.Element;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = sessionStorage.getItem("mekyasAuth") === "true";
  const { pathname, search } = useLocation();

  if (isAuthenticated) {
    // Optional: clear token so login is required next visit
    sessionStorage.removeItem("mekyasAuth");
    return children;
  }

  const nextUrl = pathname + (search || "");
  return <Navigate to={`/auth/mekyas?next=${encodeURIComponent(nextUrl)}`} replace />;
}
