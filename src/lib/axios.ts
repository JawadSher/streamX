import axios from "axios";
import { useSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  const { data: session } = useSession();
  if (session?.user?._id) {
    config.headers["x-user-id"] = session.user._id;
  }
  return config;
});

export default axiosInstance;
