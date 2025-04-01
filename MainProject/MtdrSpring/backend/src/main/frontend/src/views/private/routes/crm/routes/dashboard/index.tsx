import React from "react";
import { User } from "../../../../../../interfaces/user";
import TasksTable from "./components/tasksTable";

interface DashProps {
  user: User;
}

const Dashboard: React.FC<DashProps> = ({ user }) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <h1 style={{ marginBottom: "5px" }}>Dashboard Overview</h1>
      <p style={{ color: "#6B7280", marginBottom: "40PX" }}>
        Welcome back, {user?.name}! Here's what's happening today.
      </p>

      <TasksTable />
    </div>
  );
};

export default Dashboard;
