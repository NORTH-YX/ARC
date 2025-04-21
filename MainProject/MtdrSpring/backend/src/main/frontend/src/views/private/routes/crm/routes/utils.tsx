import React from "react";

export const getStatusTag = (status: string): { label: React.ReactNode; color: string; bgcolor: string } => {
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
    case "Blocked":
      bgcolor = "#FEE2E2";
      textColor = "#991B1B";
      break;
    default:
      bgcolor = "gray";
  }

  return {
    label: <span style={{ color: textColor }}>{status}</span>,
    color: textColor,
    bgcolor: bgcolor
  };
};

export const shortenText = (text: string, maxWords: number): string => {
  const words = text.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return text;
};
