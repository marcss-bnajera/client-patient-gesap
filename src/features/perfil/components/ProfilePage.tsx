import React, { useEffect, useState } from "react";
import {
  FiUser, FiMapPin, FiPhone, FiMail,
  FiEdit2, FiSave, FiX, FiLoader,
} from "react-icons/fi";
import { getProfileApi, updateProfileApi, type PatientProfile, type UpdateProfilePayload } from "../../../shared/api/profile";
import toast from "react-hot-toast";

export const ProfilePage: React.FC = () => {
  const [profile, setProfile]   = useState<PatientProfile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState<UpdateProfilePayload>({});

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await getProfileApi();
      setProfile(data);
      setForm({
        firstName:     data.firstName     ?? "",
        secondName:    data.secondName    ?? "",
        thirdName:     data.thirdName     ?? "",
        firstLastName:  data.firstLastName  ?? "",
        secondLastName: data.secondLastName ?? "",
        address: data.address ?? "",
        phone:   data.phone   ?? "",
      });
    } catch {
      toast.error("No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await updateProfileApi(form);
      setProfile(data);
      setEditing(false);
      toast.success("Perfil actualizado correctamente");
    } catch {
      toast.error("Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof UpdateProfilePayload) => ({
    value: (form[key] ?? "") as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
    disabled: !editing,
    className: `w-full px-4 py-2.5 text-sm border rounded-xl text-[#0A2647] transition-all
      ${editing
        ? "bg-white border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent"
        : "bg-[#EBF5FB] border-blue-100 cursor-default"
      }`,
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <FiLoader className="animate-spin text-[#0E6BA8]" size={32} />
    </div>
  );

  const fullName = [
    profile?.firstName, profile?.secondName, profile?.thirdName,
    profile?.firstLastName, profile?.secondLastName,
  ].filter(Boolean).join(" ") || "Sin nombre";

  const initials = [profile?.firstName, profile?.firstLastName]
    .filter(Boolean)
    .map((w) => w![0].toUpperCase())
    .join("");

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A2647]">Mi Perfil</h2>
          <p className="text-slate-500 text-sm mt-0.5">Gestiona tu información personal.</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0E6BA8] text-white text-sm font-semibold rounded-xl hover:bg-[#00ACC1] transition-colors"
          >
            <FiEdit2 size={14} /> Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => { setEditing(false); fetchProfile(); }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              <FiX size={14} /> Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[#0A2647] text-white text-sm font-semibold rounded-xl hover:bg-[#0E6BA8] transition-colors disabled:opacity-60"
            >
              {saving ? <FiLoader className="animate-spin" size={14} /> : <FiSave size={14} />}
              Guardar
            </button>
          </div>
        )}
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0E6BA8] to-[#00ACC1] flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
          {initials || <FiUser size={28} />}
        </div>
        <div>
          <p className="text-xl font-extrabold text-[#0A2647]">{fullName}</p>
          <p className="text-sm text-slate-500">{profile?.email}</p>
          <span className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            profile?.status === "APPROVED"
              ? "bg-emerald-50 text-emerald-600"
              : profile?.status === "PENDING"
              ? "bg-amber-50 text-amber-600"
              : "bg-red-50 text-red-500"
          }`}>
            {profile?.status === "APPROVED" ? "Aprobado" : profile?.status === "PENDING" ? "Pendiente" : "Rechazado"}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-6 space-y-5">
        <h3 className="text-[#0A2647] font-bold text-base flex items-center gap-2">
          <FiUser className="text-[#00ACC1]" size={16} /> Datos personales
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
              Primer nombre
            </label>
            <input {...field("firstName")} placeholder="Ej. Juan" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
              Segundo nombre
            </label>
            <input {...field("secondName")} placeholder="Ej. Carlos" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
              Tercer nombre
            </label>
            <input {...field("thirdName")} placeholder="Opcional" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
              Primer apellido
            </label>
            <input {...field("firstLastName")} placeholder="Ej. Pérez" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
              Segundo apellido
            </label>
            <input {...field("secondLastName")} placeholder="Ej. García" />
          </div>
        </div>

        <div className="pt-2 border-t border-blue-50">
          <h3 className="text-[#0A2647] font-bold text-base flex items-center gap-2 mb-4">
            <FiMapPin className="text-[#00ACC1]" size={16} /> Información de contacto
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
                <span className="flex items-center gap-1"><FiPhone size={11} /> Teléfono (8 dígitos)</span>
              </label>
              <input
                {...field("phone")}
                placeholder="Ej. 55551234"
                maxLength={8}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 8) }))}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
                <span className="flex items-center gap-1"><FiMail size={11} /> Correo electrónico</span>
              </label>
              <input
                value={profile?.email ?? ""}
                disabled
                className="w-full px-4 py-2.5 text-sm border rounded-xl text-slate-400 bg-[#EBF5FB] border-blue-100 cursor-default"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
                <span className="flex items-center gap-1"><FiMapPin size={11} /> Dirección</span>
              </label>
              <input {...field("address")} placeholder="Ej. Zona 1, Ciudad de Guatemala" />
            </div>
          </div>
        </div>
      </div>

      {/* DPI info */}
      <div className="bg-[#EBF5FB] rounded-2xl border border-blue-100 px-5 py-4 text-sm text-slate-500">
        <span className="font-semibold text-[#0A2647]">DPI:</span> {profile?.dpi ?? "—"}
        <span className="ml-2 text-xs">(No se puede modificar)</span>
      </div>
    </div>
  );
};
