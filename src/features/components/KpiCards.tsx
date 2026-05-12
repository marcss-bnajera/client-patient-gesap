import React from 'react';
import { FiActivity, FiTrendingUp } from "react-icons/fi";

interface Treatment {
    medicine: string;
    dosage: string;
    status: string;
    color: string;
}

const activeTreatments: Treatment[] = [
    { medicine: "Amoxicilina 500mg", dosage: "Cada 8 horas por 7 días", status: "En curso", color: "#00ACC1" },
    { medicine: "Ibuprofeno 400mg", dosage: "Solo en caso de dolor", status: "Activo", color: "#26A69A" },
];

export const KpiCards: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeTreatments.map((t, i) => (
                <div
                    key={i}
                    className="rounded-2xl p-5 shadow-sm border border-blue-100/60 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all animate-fadeIn"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md"
                            style={{ background: `linear-gradient(135deg, ${t.color}, #0E6BA8)` }}
                        >
                            <FiActivity size={20} />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 uppercase">
                            <FiTrendingUp size={11} /> {t.status}
                        </span>
                    </div>

                    <p className="text-xl font-extrabold text-[#0A2647] leading-tight mb-1">
                        {t.medicine}
                    </p>
                    <p className="text-sm font-medium text-slate-500">{t.dosage}</p>
                    <div className="mt-3 pt-3 border-t border-blue-50">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tratamiento Actual</p>
                    </div>
                </div>
            ))}
        </div>
    );
};