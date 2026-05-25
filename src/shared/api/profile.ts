import { axiosPortal } from "./api";

export interface PatientProfile {
  id: number;
  dpi: string;
  email: string;
  status: string;
  firstName?: string;
  secondName?: string;
  thirdName?: string;
  firstLastName?: string;
  secondLastName?: string;
  address?: string;
  phone?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  secondName?: string;
  thirdName?: string;
  firstLastName?: string;
  secondLastName?: string;
  address?: string;
  phone?: string;
}

export const getProfileApi = () =>
  axiosPortal.get<PatientProfile>("/profile");

export const updateProfileApi = (payload: UpdateProfilePayload) =>
  axiosPortal.patch<PatientProfile>("/profile", payload);
