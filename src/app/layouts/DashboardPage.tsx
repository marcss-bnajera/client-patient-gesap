import React from 'react';
import { FiCalendar, FiClipboard, FiAlertCircle, FiChevronRight } from "react-icons/fi";
import { KpiCards } from "../../features/components/KpiCards";

interface HospitalRecord {
    type: 'Consulta' | 'Emergencia' | 'Cita';
    reason: string;
    date: string;
    doctor: string;
}

const recentRecords: HospitalRecord[] = [
    { type: 'Cita', reason: 'Control de Cardiología', date: 'Mañana, 09:00 AM', doctor: 'Dr. García' },
    { type: 'Consulta', reason: 'Revisión General', date: '15 de Mayo, 2024', doctor: 'Dra. López' },
    { type: 'Emergencia', reason: 'Crisis Alérgica', date: '02 de Mayo, 2024', doctor: 'Turno A' },
];

export const DashboardPage: React.FC = () => {
    const dateStr: string = new Date().toLocaleDateString("es-GT", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    return (
        /* max-w-7xl para que se alargue un poco más en pantallas grandes */
        <div className="w-full max-w-7xl mx-auto space-y-7 animate-fadeIn pb-10">

            {/* 1. HEADER - Estilizado y balanceado */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#0A2647] tracking-tight">Hola, Juan Pérez</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Resumen actualizado de tu historial de salud.</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-xl px-4 py-2 text-sm text-slate-600 shadow-sm">
                    <FiCalendar size={16} className="text-[#00ACC1]" />
                    <span className="capitalize font-medium">{dateStr}</span>
                </div>
            </div>

            {/* 2. ALERTA - Altura moderada */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                        <FiAlertCircle size={22} />
                    </div>
                    <div>
                        <p className="text-sm text-amber-900 font-bold">Cita próxima</p>
                        <p className="text-xs text-amber-800">Control de Cardiología — Mañana a las 09:00 AM con el Dr. García.</p>
                    </div>
                </div>
                <button className="text-xs font-bold text-amber-700 bg-white border border-amber-200 px-4 py-2 rounded-xl hover:bg-amber-100 transition-colors">
                    Confirmar
                </button>
            </div>

            {/* 3. MEDICAMENTOS */}
            <section>
                <h3 className="text-[#0A2647] font-bold text-lg mb-5 flex items-center gap-2">
                    Medicamentos activos
                </h3>
                <KpiCards />
            </section>

            {/* 4. RÉCORD RECIENTE - Más ancho y estilizado */}
            <section>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[#0A2647] font-bold text-lg flex items-center gap-2">
                        <FiClipboard className="text-[#00ACC1]" size={20} /> Récord Reciente
                    </h3>
                    <button className="text-xs font-bold text-[#0E6BA8] hover:underline">
                        Ver historial completo
                    </button>
                </div>

                <div className="bg-white border border-blue-50 rounded-2xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-50">
                        {recentRecords.map((record, i) => (
                            <div key={i} className="p-6 hover:bg-slate-50/50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${record.type === 'Emergencia' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                        }`}>
                                        {record.type}
                                    </span>
                                    <span className="text-slate-400 font-bold text-[10px]">{record.date.split(',')[0]}</span>
                                </div>
                                <p className="font-bold text-[#0A2647] text-base mb-0.5">{record.reason}</p>
                                <p className="text-xs text-slate-500">Dr. {record.doctor}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. CONSEJO DE SALUD - Banner elegante y alargado al pie */}
            <div className="bg-[#0A2647] rounded-2xl p-5 text-white flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-2.5 rounded-xl">
                        <FiChevronRight size={20} className="text-blue-300" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-0.5">Consejo del día</p>
                        <p className="text-base font-medium">Mantén tus vacunas al día. Tienes una revisión pendiente el próximo mes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};