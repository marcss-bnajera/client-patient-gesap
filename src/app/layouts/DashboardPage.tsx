import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCalendar, FiClipboard, FiAlertCircle, FiPhone,
  FiDroplet, FiActivity, FiUser, FiChevronRight,
} from "react-icons/fi";
import { useAuthStore } from '../../features/auth/store/authStore';
import {
  getMedicalRecordsApi, getTreatmentsApi,
  getAllergiesApi, getEmergencyContactsApi,
} from '../../shared/api';
import type { MedicalRecord, Treatment, Allergy, EmergencyContact } from '../../shared/api';

interface QuickStat {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  path: string;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [records, setRecords]       = useState<MedicalRecord[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [allergies, setAllergies]   = useState<Allergy[]>([]);
  const [contacts, setContacts]     = useState<EmergencyContact[]>([]);

  const displayName = user?.profile?.firstName
    ? `${user.profile.firstName} ${user.profile.firstLastName ?? ""}`.trim()
    : user?.email ?? "Paciente";

  const dateStr = new Date().toLocaleDateString("es-GT", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  useEffect(() => {
    getMedicalRecordsApi().then((r) => setRecords(r.data)).catch(() => {});
    getTreatmentsApi().then((r) => setTreatments(r.data)).catch(() => {});
    getAllergiesApi().then((r) => setAllergies(r.data)).catch(() => {});
    getEmergencyContactsApi().then((r) => setContacts(r.data)).catch(() => {});
  }, []);

  const quickStats: QuickStat[] = [
    { label: "Registros médicos",    value: records.length,    icon: FiClipboard,   color: "#0E6BA8", path: "/historial-clinico" },
    { label: "Tratamientos activos", value: treatments.length, icon: FiActivity,    color: "#00ACC1", path: "/tratamientos" },
    { label: "Alergias registradas", value: allergies.length,  icon: FiDroplet,     color: "#26A69A", path: "/alergias" },
    { label: "Contactos emergencia", value: contacts.length,   icon: FiPhone,       color: "#144272", path: "/contactos-emergencia" },
  ];

  const recentRecords = records.slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-7 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A2647] tracking-tight">
            Hola, {displayName}
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">Resumen actualizado de tu historial de salud.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-xl px-4 py-2 text-sm text-slate-600 shadow-sm">
          <FiCalendar size={16} className="text-[#00ACC1]" />
          <span className="capitalize font-medium hidden sm:block">{dateStr}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((s, i) => (
          <Link
            key={i}
            to={s.path}
            className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${s.color}, #0A2647)` }}
              >
                <s.icon size={18} />
              </div>
              <FiChevronRight size={14} className="text-slate-300 group-hover:text-[#00ACC1] transition-colors" />
            </div>
            <p className="text-2xl font-extrabold text-[#0A2647]">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Cuenta pendiente */}
      {user?.status === "PENDING" && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="bg-amber-100 p-2 rounded-xl text-amber-600 shrink-0">
            <FiAlertCircle size={22} />
          </div>
          <div>
            <p className="text-sm text-amber-900 font-bold">Cuenta pendiente de aprobación</p>
            <p className="text-xs text-amber-700">Un auditor revisará tu solicitud pronto.</p>
          </div>
        </div>
      )}

      {/* Perfil incompleto */}
      {!user?.profile?.firstName && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-2 rounded-xl text-[#0E6BA8] shrink-0">
              <FiUser size={20} />
            </div>
            <div>
              <p className="text-sm text-[#0A2647] font-bold">Completa tu perfil</p>
              <p className="text-xs text-slate-600">Agrega tu nombre y datos de contacto.</p>
            </div>
          </div>
          <Link
            to="/perfil"
            className="text-xs font-bold text-[#0E6BA8] bg-white border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Ir al perfil
          </Link>
        </div>
      )}

      {/* Historial reciente */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#0A2647] font-bold text-lg flex items-center gap-2">
            <FiClipboard className="text-[#00ACC1]" size={20} />
            Registros Recientes
          </h3>
          <Link to="/historial-clinico" className="text-xs font-bold text-[#0E6BA8] hover:underline">
            Ver historial completo
          </Link>
        </div>

        {recentRecords.length === 0 ? (
          <div className="bg-white border border-blue-50 rounded-2xl p-8 text-center text-slate-400">
            <FiClipboard size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No hay registros médicos disponibles.</p>
          </div>
        ) : (
          <div className="bg-white border border-blue-50 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-50">
              {recentRecords.map((record, i) => (
                <div key={i} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                    {new Date(record.date).toLocaleDateString("es-GT")}
                  </p>
                  <p className="font-bold text-[#0A2647] text-base mb-0.5">
                    {record.diagnosis ?? "Sin diagnóstico"}
                  </p>
                  {record.doctor && <p className="text-xs text-slate-500">{record.doctor}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Banner inferior */}
      <div className="bg-[#0A2647] rounded-2xl p-5 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2.5 rounded-xl">
            <FiActivity size={20} className="text-blue-300" />
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-0.5">Tu bienestar</p>
            <p className="text-base font-medium">Mantén actualizados tus datos y contactos de emergencia.</p>
          </div>
        </div>
        <Link
          to="/perfil"
          className="text-xs font-bold text-white bg-white/10 border border-white/20 px-4 py-2 rounded-xl hover:bg-white/20 transition-colors shrink-0"
        >
          Ver perfil
        </Link>
      </div>
    </div>
  );
};
