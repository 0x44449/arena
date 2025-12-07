import { supabase } from "@/libs/supabase";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8002",
});

apiClient.interceptors.request.use(
  async (config) => {
    const { data } = await supabase.auth.getSession();

    if (data.session?.access_token) {
      config.headers.Authorization = `Bearer ${data.session.access_token}`;
    }

    return config;
  }
);

export default apiClient;