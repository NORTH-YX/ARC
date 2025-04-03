import React from "react";
import { User } from "../../../../../../interfaces/user";

interface ReportsProps {
  user: User;
}

const Reports: React.FC<ReportsProps> = ({ user }) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <h1 style={{ marginBottom: "5px" }}>Reports</h1>
      <p style={{ color: "#6B7280", marginBottom: "40PX" }}>
        View and analyze project metrics and team performance for {user?.role === 'admin' ? 'all teams' : 'your team'}.
      </p>
      {/* Reports content will go here */}
    </div>
  );
};

export default Reports; 