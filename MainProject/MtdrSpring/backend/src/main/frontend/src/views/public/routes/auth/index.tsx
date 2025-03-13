import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TopBarProgress from "react-topbar-progress-indicator";
import { LoginCredentials } from "../../../../api/auth";

const Login = lazy(() => import("./login"));
const RecoverPassword = lazy(() => import("./recoverPassword"));

interface AuthProps {
  setUser: (credentials: LoginCredentials) => void;
}

const Auth: React.FC<AuthProps> = ({ setUser }) => {
  return (
    <Suspense fallback={<TopBarProgress />}>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/recover" element={<RecoverPassword />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Suspense>
  );
};

export default Auth;
