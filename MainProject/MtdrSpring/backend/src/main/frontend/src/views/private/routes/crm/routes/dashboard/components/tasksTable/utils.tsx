import React from 'react';
import { Tag } from 'antd';

export const getStatusTag = (status: string): React.ReactNode => {
  let color;
  switch (status) {
    case "To Do":
      color = "blue";
      break;
    case "In Progress":
      color = "orange";
      break;
    case "Completed":
      color = "green";
      break;
    default:
      color = "gray";
  }

  return (
    <Tag
      style={{ borderRadius: "10px", border: "none", padding: "7px 15px" }}
      color={color}
    >
      {status}
    </Tag>
  );
}; 