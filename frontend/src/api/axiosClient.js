
import axios from "axios";

// Connect localhost
// const axiosClient = axios.create({baseURL: "http://127.0.0.1:8000",});

// Connect Vercel
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

console.log("API URL:", import.meta.env.VITE_API_URL);

axiosClient.interceptors.request.use((config) => {

    const token = localStorage.getItem("access_token");

    if(token){
        config.headers.Authorization = `Bearer ${token} `;
    }

    return config
})


export default axiosClient;
