import React from "react";
import { Tag } from "antd";

export const getStatusTag = (status: string): React.ReactNode => {
  let bgcolor;
  let textColor = "black";
  let text;

  switch (status) {
    case "on-hold":
      bgcolor = "#DBEAFE";
      textColor = "#2563EB";
      text = "On Hold";
      break;
    case "Active":
      bgcolor = "#FEF3C7";
      textColor = "#92400E";
      text = "In Progress";
      break;
    case "Completed":
      bgcolor = "#D1FAE5";
      textColor = "#065F46";
      text = "Completed";
      break;
    default:
      bgcolor = "gray";
  }

  return (
    <Tag
      style={{ borderRadius: "15px", border: "none", padding: "7px 15px" }}
      color={bgcolor}
    >
      <p style={{ color: textColor, fontSize: "14px", margin: 0 }}>{text}</p>
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
