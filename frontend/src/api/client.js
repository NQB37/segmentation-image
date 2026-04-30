import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3700';

const apiClient = axios.create({
  baseURL: API_URL,
});

export { API_URL };
export default apiClient;
