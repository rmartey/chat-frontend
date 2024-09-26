import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const API = axios.create({ baseURL: BASE_URL });

export const getMessages = (id) => API.get(`/messages/${id}`);

export const sendMessage = (message) => API.post("/messages", message);
