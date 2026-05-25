import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../../shared/components/layouts/MainLayout';
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute';
import { LoginForm } from '../../features/auth/components/LoginForm';
import { RegisterForm } from '../../features/auth/components/RegisterForm';
import { DashboardPage } from '../layouts/DashboardPage';
import { ProfilePage } from '../../features/perfil/components/ProfilePage';
import { EmergencyContactsPage } from '../../features/contactosEmergencia/components/EmergencyContactsPage';
import { MedicalRecordsPage } from '../../features/historialClinico/components/MedicalRecordsPage';
import { TreatmentsPage } from '../../features/tratamientos/components/TreatmentsPage';
import { AllergiesPage } from '../../features/alergias/components/AllergiesPage';
import { MyEmergenciesPage } from '../../features/misEmergencias/components/MyEmergenciesPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/registro" element={<RegisterForm />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<DashboardPage />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route path="contactos-emergencia" element={<EmergencyContactsPage />} />
        <Route path="historial-clinico" element={<MedicalRecordsPage />} />
        <Route path="tratamientos" element={<TreatmentsPage />} />
        <Route path="alergias" element={<AllergiesPage />} />
        <Route path="mis-emergencias" element={<MyEmergenciesPage />} />
      </Route>

      <Route path="*" element={
        <div className="min-h-screen bg-[#EBF5FB] flex items-center justify-center">
          <div className="text-center">
            <p className="text-8xl font-extrabold text-[#0A2647]/10">404</p>
            <h2 className="text-2xl font-bold text-[#0A2647] mt-2">Página no encontrada</h2>
            <a href="/login" className="mt-4 inline-block text-[#0E6BA8] font-semibold hover:text-[#00ACC1] transition-colors">
              ← Volver al inicio
            </a>
          </div>
        </div>
      } />
    </Routes>
  );
};
