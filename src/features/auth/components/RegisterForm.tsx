import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import imgLogo from "../../../assets/img/GESAPLogo.svg";
import {
  FiMail, FiLock, FiEye, FiEyeOff,
  FiCreditCard, FiLoader, FiArrowLeft,
} from "react-icons/fi";
import { registerApi } from "../../../shared/api/auth";
import toast from "react-hot-toast";

export const RegisterForm: React.FC = () => {
  const [showPass, setShowPass] = useState(false);
  const [dpi, setDpi] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^\d{13}$/.test(dpi)) {
      toast.error("El DPI debe tener exactamente 13 dígitos");
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      toast.error("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número");
      return;
    }
    setLoading(true);
    try {
      await registerApi({ dpi, email, password });
      toast.success("Cuenta creada. Espera la aprobación de un auditor para poder ingresar.");
      navigate("/login");
    } catch (err: unknown) {
      const msg =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (err as { response: { data: { message: string } } }).response.data.message
          : "Error al crear la cuenta";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF5FB] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="bg-[#0A2647] p-3 rounded-xl">
            <img src={imgLogo} alt="GESAP" className="h-8 w-8 brightness-0 invert" />
          </div>
          <div>
            <h1 className="text-[#0A2647] font-bold text-xl">GESAP</h1>
            <p className="text-blue-500 text-xs">Portal del Paciente</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
          <div className="mb-7">
            <h2 className="text-[#0A2647] text-2xl font-bold">Crear cuenta</h2>
            <p className="text-slate-500 text-sm mt-1">
              Tu DPI debe estar registrado en el sistema hospitalario.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* DPI */}
            <div>
              <label className="block text-xs font-semibold text-[#144272] mb-2 uppercase tracking-wide">
                DPI (13 dígitos)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiCreditCard className="text-[#0E6BA8]" size={16} />
                </div>
                <input
                  type="text"
                  value={dpi}
                  onChange={(e) => setDpi(e.target.value.replace(/\D/g, "").slice(0, 13))}
                  placeholder="0000000000000"
                  required
                  maxLength={13}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl
                    text-[#0A2647] placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent
                    transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{dpi.length}/13 dígitos</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#144272] mb-2 uppercase tracking-wide">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiMail className="text-[#0E6BA8]" size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl
                    text-[#0A2647] placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent
                    transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#144272] mb-2 uppercase tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="text-[#0E6BA8]" size={16} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl
                    text-[#0A2647] placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent
                    transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0E6BA8] transition-colors"
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Mín. 8 caracteres, una mayúscula y un número.</p>
            </div>

            {/* Info box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              Tras registrarte, tu cuenta quedará <strong>pendiente de aprobación</strong>. Un auditor la revisará antes de que puedas ingresar.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] hover:from-[#144272] hover:to-[#00ACC1]
                text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-900/25
                transition-all duration-200 hover:shadow-xl active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={16} />
                  Creando cuenta...
                </>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-[#0E6BA8] hover:text-[#00ACC1] font-medium transition-colors"
            >
              <FiArrowLeft size={14} />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          © 2026 GESAP · Sistema Hospitalario de Guatemala
        </p>
      </div>
    </div>
  );
};
