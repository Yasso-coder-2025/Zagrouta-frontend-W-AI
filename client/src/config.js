// client/src/config.js

// This file contains global configuration for the application.
// Hardcode the Railway backend URL here to completely bypass Vercel's environment variables cache issues.

export const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? "http://localhost:8080/api" 
  : "https://zagrouta-backend-w-ai-production.up.railway.app/api";
