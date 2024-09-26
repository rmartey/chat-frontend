import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const API = axios.create({ baseURL: BASE_URL });

export const createChat = (chat) => API.post("/chats", chat);

export const userChats = (id) => API.get(`/chats/${id}`);
