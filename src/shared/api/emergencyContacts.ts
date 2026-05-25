import { axiosPortal } from "./api";

export interface EmergencyContact {
  id: number;
  fullName: string;
  phone: string;
  relationship?: string;
}

export interface EmergencyContactPayload {
  fullName: string;
  phone: string;
  relationship?: string;
}

export const getEmergencyContactsApi = () =>
  axiosPortal.get<EmergencyContact[]>("/emergency-contacts");

export const createEmergencyContactApi = (payload: EmergencyContactPayload) =>
  axiosPortal.post<EmergencyContact>("/emergency-contacts", payload);

export const updateEmergencyContactApi = (id: number, payload: EmergencyContactPayload) =>
  axiosPortal.put<EmergencyContact>(`/emergency-contacts/${id}`, payload);

export const deleteEmergencyContactApi = (id: number) =>
  axiosPortal.delete(`/emergency-contacts/${id}`);
