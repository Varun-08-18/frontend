import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "EMPLOYEE" | "MANAGER" | "ADMIN";
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export async function login(
  data: LoginData,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    data,
  );

  const result = response.data;

  if (typeof window !== "undefined") {
    localStorage.setItem("token", result.access_token);
    localStorage.setItem(
      "user",
      JSON.stringify(result.user),
    );
  }

  return result;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as User;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}