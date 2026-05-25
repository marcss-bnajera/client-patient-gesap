import { axiosPortal } from "./api";

export interface MyEmergency {
  id: number;
  date: string;
  reason?: string;
  status?: string;
  hospital?: string;
  attendedBy?: string;
  notes?: string;
}

export const getMyEmergenciesApi = () =>
  axiosPortal.get<MyEmergency[]>("/my-emergencies");

export const getMyEmergencyByIdApi = (id: number) =>
  axiosPortal.get<MyEmergency>(`/my-emergencies/${id}`);

export const getEmergencyConstanciaApi = (id: number) =>
  axiosPortal.get<Blob>(`/my-emergencies/${id}/constancia`, {
    responseType: "blob",
  });
