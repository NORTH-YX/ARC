import React from "react";
import { User } from "../../../../../../interfaces/user";

interface DashProps {
  user: User;
}

const Dashboard: React.FC<DashProps> = ({ user }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        height: "100%",
        width: "100%",
      }}
    >
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard</p>
      <p>{user?.name}</p>
    </div>
  );
};

export default Dashboard;
