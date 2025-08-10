// Services to handle API interactions
// api.js - Base API setup
import axios from 'axios';
import config from '../lib/config'
import { getAuthorizationHeader } from "../utils/cookies";

const api = axios.create({
  baseURL: config.API_URL,
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = getAuthorizationHeader();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;