// client/src/utils/api.js

/**
 * Gets the base API URL, ensuring it has the correct protocol and suffix.
 * This helps prevent misconfigurations in Vercel environment variables.
 */
export const getApiBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Local development fallback
  if (!envUrl) {
    return "http://localhost:8080/api";
  }

  // If the user pasted the Railway URL without https://, add it
  if (!envUrl.startsWith("http://") && !envUrl.startsWith("https://")) {
    envUrl = "https://" + envUrl;
  }

  // Remove trailing slashes
  envUrl = envUrl.replace(/\/+$/, "");

  // Ensure it ends with /api
  if (!envUrl.endsWith("/api")) {
    envUrl = envUrl + "/api";
  }

  return envUrl;
};
