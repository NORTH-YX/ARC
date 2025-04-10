import React from "react";
import { Tag } from "antd";

export const getStatusTag = (status: string): React.ReactNode => {
  let bgcolor;
  let textColor = "black";

  switch (status) {
    case "To Do":
      bgcolor = "#DBEAFE";
      textColor = "#2563EB";
      break;
    case "In Progress":
      bgcolor = "#FEF3C7";
      textColor = "#92400E";
      break;
    case "Completed":
      bgcolor = "#D1FAE5";
      textColor = "#065F46";
      break;
    default:
      bgcolor = "gray";
  }

  return (
    <Tag
      style={{ borderRadius: "15px", border: "none", padding: "7px 15px" }}
      color={bgcolor}
    >
      <p style={{ color: textColor, fontSize: "14px", margin: 0 }}>{status}</p>
    </Tag>
  );
};

export const shortenText = (text: string, maxWords: number): string => {
  const words = text.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return text;
};

export const getInitials = (name: string): string => {  
  const names = name.split(" ");
  const initials = names
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join("");
  return initials;
};