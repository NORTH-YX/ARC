import { Tag } from "antd";
import { ResponsiveTag } from "./elements";
import { format } from "date-fns";

export const getStatusTag = (status: string) => {
  let bgcolor;
  let textColor = "black";
  let text;

  switch (status) {
    case "To Do":
      bgcolor = "#DBEAFE";
      textColor = "#2563EB";
      text = "To Do";
      break;
    case "In Progress":
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
      text = "Blocked";
      break;
    default:
      bgcolor = "gray";
  }

  return {
    label: <span style={{ color: textColor }}>{text}</span>,
    color: textColor,
    bgcolor: bgcolor,
  };
};

// Format date in a more readable way: "Apr 13, 6:01 p.m."
export const formatReadableDate = (dateString: string | null) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return format(date, "MMM d, h:mm a");
};

// Custom date comparison for sorting
export const compareDates = (a: string | null, b: string | null) => {
  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;
  return new Date(a).getTime() - new Date(b).getTime();
};

// Constants for tasks status
export const TASK_STATUSES = ["To Do", "In Progress", "Completed", "Blocked"];

export const getProjectStatus = (status: string) => {
  let bgcolor;
  let textColor = "black";
  let text;

  switch (status) {
    case "Active":
      bgcolor = "#FEF3C7";
      textColor = "#92400E";
      text = "In Progress";
      break;
    case "on-hold":
      bgcolor = "#E0F2FE";
      textColor = "#0C4A6E";
      text = "On Hold";
      break;
    case "Completed":
      bgcolor = "#BBF7D0";
      textColor = "#065F46";
      text = "Completed";
      break;
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

export const getTaskStatus = (category: string) => {
  let bgcolor;
  let textColor = "black";

  switch (category) {
    case "Completed":
      bgcolor = "#BBF7D0";
      textColor = "#065F46";
      break;
    case "In Progress":
      bgcolor = "#FEF3C7";
      textColor = "#92400E";
      break;
    case "Blocked":
      bgcolor = "#FEE2E2";
      textColor = "#7F1D1D";
      break;
    case "To Do":
      bgcolor = "#E0F2FE";
      textColor = "#0C4A6E";
      break;
    default:
      bgcolor = "gray";
  }

  return (
    <ResponsiveTag
      style={{ borderRadius: "15px", border: "none", padding: "7px 15px" }}
      color={bgcolor}
    >
      <p style={{ color: textColor, fontSize: "12px", margin: 0 }}>
        {category}
      </p>
    </ResponsiveTag>
  );
};

export const getSprintStatus = (status: string) => {
  let bgcolor;
  let textColor = "black";
  let text;

  switch (status) {
    case "Planned":
      bgcolor = "#DBEAFE";
      textColor = "#2563EB";
      text = "Planned";
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
      textColor = "#7F1D1D";
      text = "Blocked";
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

export const getTimeLineFormat = (initialDate: string, finalDate: string) => {
  if (!initialDate || !finalDate) return "";

  try {
    const initialDateObj = new Date(initialDate);
    const finalDateObj = new Date(finalDate);

    const sameYear =
      initialDateObj.getFullYear() === finalDateObj.getFullYear();

    // Opciones para el formato de fecha
    const initialOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: sameYear ? undefined : "numeric",
    };

    const finalOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    const initialDateFormatted = initialDateObj.toLocaleDateString(
      "en-US",
      initialOptions
    );
    const finalDateFormatted = finalDateObj.toLocaleDateString(
      "en-US",
      finalOptions
    );

    return `${initialDateFormatted} - ${finalDateFormatted}`;
  } catch (error) {
    console.error("Error formatting dates:", error);
    return "Invalid date range";
  }
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
