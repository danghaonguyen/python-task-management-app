

import axios from "axios";

// Conect localhost
// const axiosAuth = axios.create({
//   baseURL: "http://127.0.0.1:8000",
// });

// Connect Vercel
const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default axiosAuth;
