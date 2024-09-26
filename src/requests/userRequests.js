import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const API = axios.create({ baseURL: BASE_URL });

export const getUser = (id) => API.get(`/users/${id}`);

export const getUsers = () => API.get("/users");
