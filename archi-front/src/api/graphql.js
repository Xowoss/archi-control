import axios from "axios";
import { getToken } from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:8080/graphql",
});

api.interceptors.request.use((config) => {
  const token = getToken();

  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export default api;
