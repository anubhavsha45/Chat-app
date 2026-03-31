import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5001/api/v1",
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) req.headers.Authorization = `Bearer ${user.token}`;
  return req;
});
