import React, { useEffect, useState } from "react";
import {
  FiAlertCircle, FiLoader, FiCalendar,
  FiDownload, FiChevronRight, FiX,
} from "react-icons/fi";
import {
  getMyEmergenciesApi, getMyEmergencyByIdApi,
  getEmergencyConstanciaApi, type MyEmergency,
} from "../../../shared/api/myEmergencies";
import toast from "react-hot-toast";

export const MyEmergenciesPage: React.FC = () => {
  const [emergencies, setEmergencies] = useState<MyEmergency[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState<MyEmergency | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    getMyEmergenciesApi()
      .then((r) => setEmergencies(r.data))
      .catch(() => toast.error("No se pudieron cargar las emergencias"))
      .finally(() => setLoading(false));
  }, []);

  const openDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const { data } = await getMyEmergencyByIdApi(id);
      setSelected(data);
    } catch {
      toast.error("No se pudo cargar el detalle");
    } finally {
      setDetailLoading(false);
    }
  };

  const downloadConstancia = async (id: number) => {
    setDownloading(id);
    try {
      const { data } = await getEmergencyConstanciaApi(id);
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `constancia-emergencia-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Constancia descargada");
    } catch {
      toast.error("No se pudo descargar la constancia");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-[#0A2647]">Mis Emergencias</h2>
        <p className="text-slate-500 text-sm mt-0.5">Historial de atenciones de emergencia (solo lectura).</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FiLoader className="animate-spin text-[#0E6BA8]" size={28} />
        </div>
      ) : emergencies.length === 0 ? (
        <div className="bg-white border border-blue-50 rounded-2xl p-10 text-center text-slate-400 shadow-sm">
          <FiAlertCircle size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No tienes emergencias registradas</p>
          <p className="text-sm mt-1">Las atenciones de emergencia aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {emergencies.map((e) => (
            <div
              key={e.id}
              className="bg-white rounded-2xl border border-blue-50 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white shrink-0">
                <FiAlertCircle size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0A2647] truncate">
                  {e.reason ?? "Atención de emergencia"}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <FiCalendar size={11} />
                    {new Date(e.date).toLocaleDateString("es-GT", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </span>
                  {e.status && (
                    <span className="px-2 py-0.5 bg-slate-50 rounded-full text-[10px] font-bold uppercase">
                      {e.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => downloadConstancia(e.id)}
                  disabled={downloading === e.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0E6BA8] border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  {downloading === e.id
                    ? <FiLoader className="animate-spin" size={12} />
                    : <FiDownload size={12} />
                  }
                  Constancia
                </button>
                <button
                  onClick={() => openDetail(e.id)}
                  className="p-2 text-slate-400 hover:text-[#0E6BA8] hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {(selected || detailLoading) && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {detailLoading ? (
              <div className="flex items-center justify-center py-10">
                <FiLoader className="animate-spin text-[#0E6BA8]" size={28} />
              </div>
            ) : selected && (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-[#0A2647]">Detalle de emergencia</h3>
                  <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                    <FiX size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Motivo",    value: selected.reason },
                    { label: "Estado",    value: selected.status },
                    { label: "Hospital",  value: selected.hospital },
                    { label: "Atendido por", value: selected.attendedBy },
                    { label: "Fecha",     value: new Date(selected.date).toLocaleDateString("es-GT", { dateStyle: "long" }) },
                    { label: "Notas",     value: selected.notes },
                  ].map(({ label, value }) =>
                    value ? (
                      <div key={label} className="flex gap-3">
                        <span className="text-xs font-semibold text-[#144272] w-28 shrink-0 pt-0.5 uppercase tracking-wide">
                          {label}
                        </span>
                        <span className="text-sm text-[#0A2647]">{value}</span>
                      </div>
                    ) : null
                  )}
                </div>

                <button
                  onClick={() => downloadConstancia(selected.id)}
                  disabled={downloading === selected.id}
                  className="mt-6 w-full py-2.5 text-sm font-semibold text-white bg-[#0A2647] rounded-xl hover:bg-[#0E6BA8] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {downloading === selected.id
                    ? <FiLoader className="animate-spin" size={14} />
                    : <FiDownload size={14} />
                  }
                  Descargar constancia
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
