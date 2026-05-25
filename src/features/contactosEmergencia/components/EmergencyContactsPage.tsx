import React, { useEffect, useState } from "react";
import {
  FiPhone, FiPlus, FiEdit2, FiTrash2,
  FiLoader, FiUser, FiX, FiSave,
} from "react-icons/fi";
import {
  getEmergencyContactsApi, createEmergencyContactApi,
  updateEmergencyContactApi, deleteEmergencyContactApi,
  type EmergencyContact, type EmergencyContactPayload,
} from "../../../shared/api/emergencyContacts";
import toast from "react-hot-toast";

const MAX_CONTACTS = 5;

const emptyForm: EmergencyContactPayload = { fullName: "", phone: "", relationship: "" };

export const EmergencyContactsPage: React.FC = () => {
  const [contacts, setContacts]   = useState<EmergencyContact[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<EmergencyContact | null>(null);
  const [form, setForm]           = useState<EmergencyContactPayload>(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState<number | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await getEmergencyContactsApi();
      setContacts(data);
    } catch {
      toast.error("No se pudieron cargar los contactos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (c: EmergencyContact) => {
    setEditing(c);
    setForm({ fullName: c.fullName, phone: c.phone, relationship: c.relationship ?? "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!/^\d{8}$/.test(form.phone)) {
      toast.error("El teléfono debe tener exactamente 8 dígitos");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateEmergencyContactApi(editing.id, form);
        toast.success("Contacto actualizado");
      } else {
        await createEmergencyContactApi(form);
        toast.success("Contacto agregado");
      }
      setShowModal(false);
      fetch();
    } catch (err: unknown) {
      const msg =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Error al guardar"
          : "Error al guardar";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await deleteEmergencyContactApi(id);
      toast.success("Contacto eliminado");
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch {
      toast.error("Error al eliminar el contacto");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A2647]">Contactos de Emergencia</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {contacts.length}/{MAX_CONTACTS} contactos registrados.
          </p>
        </div>
        <button
          onClick={openCreate}
          disabled={contacts.length >= MAX_CONTACTS}
          className="flex items-center gap-2 px-4 py-2 bg-[#0E6BA8] text-white text-sm font-semibold rounded-xl hover:bg-[#00ACC1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiPlus size={16} /> Agregar
        </button>
      </div>

      {contacts.length >= MAX_CONTACTS && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 font-medium">
          Has alcanzado el límite de {MAX_CONTACTS} contactos de emergencia.
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FiLoader className="animate-spin text-[#0E6BA8]" size={28} />
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-white border border-blue-50 rounded-2xl p-10 text-center text-slate-400 shadow-sm">
          <FiPhone size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No tienes contactos de emergencia</p>
          <p className="text-sm mt-1">Agrega hasta {MAX_CONTACTS} personas de confianza.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-blue-50 shadow-sm px-5 py-4 flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0E6BA8] to-[#00ACC1] flex items-center justify-center text-white font-bold text-sm shrink-0">
                <FiUser size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0A2647] truncate">{c.fullName}</p>
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <FiPhone size={12} /> {c.phone}
                  {c.relationship && <span className="text-slate-300">·</span>}
                  {c.relationship && <span>{c.relationship}</span>}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(c)}
                  className="p-2 text-[#0E6BA8] hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <FiEdit2 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={deleting === c.id}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                >
                  {deleting === c.id
                    ? <FiLoader className="animate-spin" size={15} />
                    : <FiTrash2 size={15} />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#0A2647]">
                {editing ? "Editar contacto" : "Nuevo contacto"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
                  Nombre completo *
                </label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  placeholder="Ej. María García"
                  className="w-full px-4 py-2.5 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl text-[#0A2647]
                    focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
                  Teléfono (8 dígitos) *
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 8) }))}
                  placeholder="55551234"
                  maxLength={8}
                  className="w-full px-4 py-2.5 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl text-[#0A2647]
                    focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
                  Parentesco / Relación
                </label>
                <input
                  value={form.relationship ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, relationship: e.target.value }))}
                  placeholder="Ej. Madre, Esposo, Amigo"
                  className="w-full px-4 py-2.5 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl text-[#0A2647]
                    focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.fullName || !form.phone}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#0A2647] rounded-xl hover:bg-[#0E6BA8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? <FiLoader className="animate-spin" size={14} /> : <FiSave size={14} />}
                {editing ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
