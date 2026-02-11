import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5077/api"
});

export default api;
