import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TopBarProgress from "react-topbar-progress-indicator";
import { User } from "../../../../interfaces/user";

interface DashProps {
  user: User;
}

// Common Routes for Users and Admins
const Dashboard = lazy(() => import("./routes/dashboard"));
const ProjectDashboard = lazy(() => import("./routes/projectDashboard"));
const Projects = lazy(() => import("./routes/projects"));
const Teams = lazy(() => import("./routes/teams"));
const Reports = lazy(() => import("./routes/reports"));

const CRM: React.FC<DashProps> = ({ user }) => {
  if (user?.role === "admin") {
    return (
      <Suspense fallback={<TopBarProgress />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/projects" element={<Projects user={user} />} />
          <Route
            path="/projectDashboard/:projectId"
            element={<ProjectDashboard />}
          />
          <Route path="/teams" element={<Teams user={user} />} />
          <Route path="/reports" element={<Reports user={user} />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<TopBarProgress />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route
          path="/projectDashboard/:projectId"
          element={<ProjectDashboard />}
        />
        <Route path="/projects" element={<Projects user={user} />} />
        <Route path="/teams" element={<Teams user={user} />} />
        <Route path="/reports" element={<Reports user={user} />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Suspense>
  );
};

export default CRM;
