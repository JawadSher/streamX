import { auth } from "@/app/api/auth/[...nextauth]/configs";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await auth();
  if (session?.user?._id) {
    config.headers["x-user-id"] = session.user._id;
  }
  return config;
});

export default axiosInstance;