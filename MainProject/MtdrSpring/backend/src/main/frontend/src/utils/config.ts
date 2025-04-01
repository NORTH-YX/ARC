// Function to get the backend URL from environment variables
export const getBackendUrl = (): string | undefined => {
  return process.env.REACT_APP_BACKEND_URL;
};
