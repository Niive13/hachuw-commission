import { bffFetch } from "./bff.service";
import type { Admin } from "@/types/admin";

interface LoginResponse {
  success: boolean;
  message: string;
  data: { admin: Admin };
}

interface MeResponse {
  success: boolean;
  data: Admin;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

export const authClientService = {
  async login(username: string, password: string): Promise<Admin> {
    const res = await bffFetch<LoginResponse>("/api/user/signin", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    return res.data.admin;
  },

  async logout(): Promise<void> {
    await bffFetch<LogoutResponse>("/api/user/logout", { method: "POST" });
  },

  async me(): Promise<Admin | null> {
    try {
      const res = await bffFetch<MeResponse>("/api/user/me", { method: "GET" });
      return res.data;
    } catch (e) {
      // 401 = tidak login
      return null;
    }
  },
};