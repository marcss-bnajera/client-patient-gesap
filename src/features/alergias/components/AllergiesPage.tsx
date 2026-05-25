import React, { useEffect, useState } from "react";
import { FiDroplet, FiLoader, FiAlertTriangle } from "react-icons/fi";
import { getAllergiesApi, type Allergy } from "../../../shared/api/history";
import toast from "react-hot-toast";

export const AllergiesPage: React.FC = () => {
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getAllergiesApi()
      .then((r) => setAllergies(r.data))
      .catch(() => toast.error("No se pudieron cargar las alergias"))
      .finally(() => setLoading(false));
  }, []);

  const severityStyle = (severity?: string) => {
    if (!severity) return { badge: "bg-slate-50 text-slate-500", icon: "text-slate-400" };
    const s = severity.toLowerCase();
    if (s.includes("alta") || s.includes("grave") || s.includes("sever"))
      return { badge: "bg-red-50 text-red-600", icon: "text-red-400" };
    if (s.includes("media") || s.includes("moder"))
      return { badge: "bg-amber-50 text-amber-600", icon: "text-amber-400" };
    return { badge: "bg-emerald-50 text-emerald-600", icon: "text-emerald-400" };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-[#0A2647]">Alergias</h2>
        <p className="text-slate-500 text-sm mt-0.5">Alergias registradas en tu historial (solo lectura).</p>
      </div>

      {allergies.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <FiAlertTriangle className="text-red-500 shrink-0" size={20} />
          <p className="text-sm text-red-700 font-medium">
            Tienes <strong>{allergies.length}</strong> alergia(s) registrada(s). Esta información es crítica para tu atención médica.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FiLoader className="animate-spin text-[#0E6BA8]" size={28} />
        </div>
      ) : allergies.length === 0 ? (
        <div className="bg-white border border-blue-50 rounded-2xl p-10 text-center text-slate-400 shadow-sm">
          <FiDroplet size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No tienes alergias registradas</p>
          <p className="text-sm mt-1">Las alergias documentadas por tu médico aparecerán aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allergies.map((a) => {
            const style = severityStyle(a.severity);
            return (
              <div
                key={a.id}
                className="bg-white rounded-2xl border border-blue-50 shadow-sm p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 ${style.icon}`}>
                    <FiDroplet size={18} />
                  </div>
                  {a.severity && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${style.badge}`}>
                      {a.severity}
                    </span>
                  )}
                </div>

                <p className="font-bold text-[#0A2647] text-base">{a.allergen}</p>
                {a.reaction && (
                  <p className="text-sm text-slate-500 mt-1">
                    <span className="font-semibold text-slate-600">Reacción: </span>
                    {a.reaction}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
