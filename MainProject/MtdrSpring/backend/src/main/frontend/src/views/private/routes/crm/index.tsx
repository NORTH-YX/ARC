import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TopBarProgress from "react-topbar-progress-indicator";
import { User } from "../../../../interfaces/user";

interface DashProps {
  user: User;
}

//User Routes
const Profile = lazy(() => import("./routes/dashboard"));

//Admin Routes
const AdminDashboard = lazy(() => import("./routes/dashboard"));

const CRM: React.FC<DashProps> = ({ user }) => {

  if (user?.role === "admin") {
    {
      return (
        <Suspense fallback={<TopBarProgress />}>
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard user={user} />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Suspense>
      );
    }
  }
  return (
    <Suspense fallback={<TopBarProgress />}>
      <Routes>
        <Route path="/dashboard" element={<Profile user={user} />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Suspense>
  );
};

export default CRM;
