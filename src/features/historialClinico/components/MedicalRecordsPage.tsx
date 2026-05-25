import React, { useEffect, useState } from "react";
import { FiClipboard, FiLoader, FiCalendar, FiUser } from "react-icons/fi";
import { getMedicalRecordsApi, type MedicalRecord } from "../../../shared/api/history";
import toast from "react-hot-toast";

export const MedicalRecordsPage: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMedicalRecordsApi()
      .then((r) => setRecords(r.data))
      .catch(() => toast.error("No se pudo cargar el historial clínico"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-[#0A2647]">Historial Clínico</h2>
        <p className="text-slate-500 text-sm mt-0.5">Tus registros médicos (solo lectura).</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FiLoader className="animate-spin text-[#0E6BA8]" size={28} />
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white border border-blue-50 rounded-2xl p-10 text-center text-slate-400 shadow-sm">
          <FiClipboard size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No tienes registros médicos</p>
          <p className="text-sm mt-1">Tus consultas y atenciones aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-blue-50 shadow-sm px-6 py-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0E6BA8] to-[#144272] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <FiClipboard size={17} />
                  </div>
                  <div>
                    <p className="font-bold text-[#0A2647] text-base">
                      {r.diagnosis ?? "Sin diagnóstico registrado"}
                    </p>
                    {r.notes && (
                      <p className="text-sm text-slate-500 mt-1">{r.notes}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      {r.doctor && (
                        <span className="flex items-center gap-1">
                          <FiUser size={11} /> {r.doctor}
                        </span>
                      )}
                      {r.hospital && (
                        <span>{r.hospital}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 text-xs text-slate-400">
                  <FiCalendar size={12} />
                  {new Date(r.date).toLocaleDateString("es-GT", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
