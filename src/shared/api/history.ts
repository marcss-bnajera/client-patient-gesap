import { axiosPortal } from "./api";

export interface MedicalRecord {
  id: number;
  date: string;
  diagnosis?: string;
  notes?: string;
  doctor?: string;
  hospital?: string;
}

export interface Treatment {
  id: number;
  name: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface Allergy {
  id: number;
  allergen: string;
  reaction?: string;
  severity?: string;
}

export const getMedicalRecordsApi = () =>
  axiosPortal.get<MedicalRecord[]>("/history/medical-records");

export const getTreatmentsApi = () =>
  axiosPortal.get<Treatment[]>("/history/treatments");

export const getAllergiesApi = () =>
  axiosPortal.get<Allergy[]>("/history/allergies");
