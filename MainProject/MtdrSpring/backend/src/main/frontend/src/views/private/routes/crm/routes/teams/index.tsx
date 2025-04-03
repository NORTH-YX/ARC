import React from "react";
import { User } from "../../../../../../interfaces/user";

interface TeamsProps {
  user: User;
}

const Teams: React.FC<TeamsProps> = ({ user }) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <h1 style={{ marginBottom: "5px" }}>Teams</h1>
      <p style={{ color: "#6B7280", marginBottom: "40PX" }}>
        {user?.role === 'admin' 
          ? 'Manage all teams and team members across the organization.' 
          : `Manage your team${user?.teamId ? '' : ' once you are assigned to one'}.`}
      </p>
      {/* Teams content will go here */}
    </div>
  );
};

export default Teams;
