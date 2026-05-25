import React, { useEffect, useState } from "react";
import { FiActivity, FiLoader, FiCalendar, FiClock } from "react-icons/fi";
import { getTreatmentsApi, type Treatment } from "../../../shared/api/history";
import toast from "react-hot-toast";

export const TreatmentsPage: React.FC = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getTreatmentsApi()
      .then((r) => setTreatments(r.data))
      .catch(() => toast.error("No se pudieron cargar los tratamientos"))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (status?: string) => {
    if (!status) return "bg-slate-50 text-slate-500";
    const s = status.toLowerCase();
    if (s.includes("activ") || s.includes("curso")) return "bg-emerald-50 text-emerald-600";
    if (s.includes("finaliz") || s.includes("complet")) return "bg-blue-50 text-blue-600";
    return "bg-amber-50 text-amber-600";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-[#0A2647]">Tratamientos</h2>
        <p className="text-slate-500 text-sm mt-0.5">Historial de tratamientos y medicamentos (solo lectura).</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FiLoader className="animate-spin text-[#0E6BA8]" size={28} />
        </div>
      ) : treatments.length === 0 ? (
        <div className="bg-white border border-blue-50 rounded-2xl p-10 text-center text-slate-400 shadow-sm">
          <FiActivity size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No tienes tratamientos registrados</p>
          <p className="text-sm mt-1">Los tratamientos prescritos aparecerán aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {treatments.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-blue-50 shadow-sm p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ACC1] to-[#0E6BA8] flex items-center justify-center text-white shrink-0">
                  <FiActivity size={17} />
                </div>
                {t.status && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusColor(t.status)}`}>
                    {t.status}
                  </span>
                )}
              </div>

              <p className="font-bold text-[#0A2647] text-base">{t.name}</p>
              {t.dosage && (
                <p className="text-sm text-slate-500 mt-0.5">{t.dosage}</p>
              )}
              {t.frequency && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                  <FiClock size={11} /> {t.frequency}
                </div>
              )}

              {(t.startDate || t.endDate) && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-blue-50 text-xs text-slate-400">
                  <FiCalendar size={11} />
                  {t.startDate && (
                    <span>Inicio: {new Date(t.startDate).toLocaleDateString("es-GT")}</span>
                  )}
                  {t.startDate && t.endDate && <span>→</span>}
                  {t.endDate && (
                    <span>Fin: {new Date(t.endDate).toLocaleDateString("es-GT")}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
