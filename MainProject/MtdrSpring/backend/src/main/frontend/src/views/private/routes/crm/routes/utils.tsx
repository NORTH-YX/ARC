
export const getStatusTag = (status: string) => {
  let color = "";
  let bgcolor = "";

  switch (status) {
    case "Completed":
      color = "#10B981";
      bgcolor = "#D1FAE5";
      break;
    case "In Progress":
      color = "#3B82F6";
      bgcolor = "#DBEAFE";
      break;
    case "Pending":
      color = "#F59E0B";
      bgcolor = "#FEF3C7";
      break;
    case "Canceled":
      color = "#EF4444";
      bgcolor = "#FEE2E2";
      break;
    default:
      color = "#6B7280";
      bgcolor = "#F3F4F6";
  }

  // Return a React element instead of an object
  return (
    <span style={{ 
      backgroundColor: bgcolor, 
      color: color, 
      padding: '4px 8px', 
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'medium'
    }}>
      {status}
    </span>
  );
};

export const shortenText = (text: string, maxWords: number): string => {
  const words = text.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return text;
};
