import { axiosPortal } from "./api";

export interface PatientUser {
  id: number;
  email: string;
  dpi: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  profile?: {
    firstName?: string;
    secondName?: string;
    firstLastName?: string;
    secondLastName?: string;
    address?: string;
    phone?: string;
  };
}

export interface AuthResponse {
  message: string;
  token: string;
  user: PatientUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  dpi: string;
  email: string;
  password: string;
}

export const loginApi = (payload: LoginPayload) =>
  axiosPortal.post<AuthResponse>("/auth/login", payload);

export const registerApi = (payload: RegisterPayload) =>
  axiosPortal.post<{ message: string }>("/auth/register", payload);
