import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginApi, type PatientUser } from "../../../shared/api/auth";

interface AuthState {
  user: PatientUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await loginApi({ email, password });
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err: unknown) {
          let msg = "Credenciales inválidas";
          if (
            typeof err === "object" &&
            err !== null &&
            "response" in err &&
            typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ) {
            msg = (err as { response: { data: { message: string } } }).response.data.message;
          }
          set({ loading: false, error: msg });
          throw err;
        }
      },

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false, error: null }),
    }),
    {
      name: "gesap-patient-auth",
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);
