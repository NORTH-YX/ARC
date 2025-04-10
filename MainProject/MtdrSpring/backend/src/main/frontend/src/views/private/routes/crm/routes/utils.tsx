import React from "react";

export const getStatusTag = (status: string): { label: React.ReactNode; color: string; bgcolor: string } => {
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
