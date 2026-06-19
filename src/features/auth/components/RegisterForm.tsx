import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import imgLogo from "../../../assets/img/GESAPLogo.svg";
import {
  FiMail, FiLock, FiEye, FiEyeOff,
  FiCreditCard, FiLoader, FiArrowLeft, FiCheckCircle,
} from "react-icons/fi";
import { registerApi } from "../../../shared/api/auth";
import toast from "react-hot-toast";

const validateDpi       = (v: string) => /^\d{13}$/.test(v) ? "" : "El DPI debe tener exactamente 13 dígitos";
const validateEmail     = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Correo electrónico inválido";
const validatePassword  = (v: string) => {
  if (v.length < 8)          return "Mínimo 8 caracteres";
  if (!/[A-Z]/.test(v))      return "Debe incluir al menos una mayúscula";
  if (!/\d/.test(v))         return "Debe incluir al menos un número";
  return "";
};
const validateConfirm   = (pass: string, confirm: string) => pass !== confirm ? "Las contraseñas no coinciden" : "";

export const RegisterForm: React.FC = () => {
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dpi, setDpi]                 = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirm, setConfirm]         = useState("");
  const [loading, setLoading]         = useState(false);
  const navigate = useNavigate();

  const [touched, setTouched] = useState({ dpi: false, email: false, password: false, confirm: false });

  const errors = {
    dpi:      validateDpi(dpi),
    email:    validateEmail(email),
    password: validatePassword(password),
    confirm:  validateConfirm(password, confirm),
  };

  const isValid = Object.values(errors).every((e) => !e) && dpi && email && password && confirm;

  const touch = (field: keyof typeof touched) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const fieldCls = (field: keyof typeof errors) => {
    if (!touched[field]) return "border-blue-200 focus:ring-[#00ACC1]";
    return errors[field]
      ? "border-red-300 focus:ring-red-300"
      : "border-emerald-400 focus:ring-emerald-400";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ dpi: true, email: true, password: true, confirm: true });
    if (!isValid) return;
    setLoading(true);
    try {
      await registerApi({ dpi, email, password });
      toast.success("Cuenta creada. Espera la aprobación de un auditor para poder ingresar.");
      navigate("/login");
    } catch (err: unknown) {
      const msg =
        typeof err === "object" && err !== null && "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (err as { response: { data: { message: string } } }).response.data.message
          : "Error al crear la cuenta";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "w-full py-3 text-sm bg-[#EBF5FB] border rounded-xl text-[#0A2647] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all";

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
                DPI (13 dígitos) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiCreditCard className="text-[#0E6BA8]" size={16} />
                </div>
                <input
                  type="text"
                  value={dpi}
                  onChange={(e) => setDpi(e.target.value.replace(/\D/g, "").slice(0, 13))}
                  onBlur={() => touch("dpi")}
                  placeholder="0000000000000"
                  maxLength={13}
                  className={`${inputBase} ${fieldCls("dpi")} pl-10 pr-9`}
                />
                {touched.dpi && !errors.dpi && (
                  <FiCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" size={15} />
                )}
              </div>
              {touched.dpi && errors.dpi
                ? <p className="text-red-500 text-[11px] mt-1">{errors.dpi}</p>
                : <p className="text-slate-400 text-[11px] mt-1">{dpi.length}/13 dígitos</p>
              }
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#144272] mb-2 uppercase tracking-wide">
                Correo Electrónico *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiMail className="text-[#0E6BA8]" size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => touch("email")}
                  placeholder="tu@correo.com"
                  className={`${inputBase} ${fieldCls("email")} pl-10 pr-9`}
                />
                {touched.email && !errors.email && (
                  <FiCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" size={15} />
                )}
              </div>
              {touched.email && errors.email && (
                <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#144272] mb-2 uppercase tracking-wide">
                Contraseña *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="text-[#0E6BA8]" size={16} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => touch("password")}
                  placeholder="••••••••"
                  className={`${inputBase} ${fieldCls("password")} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0E6BA8] transition-colors"
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {touched.password && errors.password
                ? <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>
                : <p className="text-slate-400 text-[11px] mt-1">Mín. 8 caracteres, una mayúscula y un número.</p>
              }
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold text-[#144272] mb-2 uppercase tracking-wide">
                Confirmar Contraseña *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="text-[#0E6BA8]" size={16} />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onBlur={() => touch("confirm")}
                  placeholder="••••••••"
                  className={`${inputBase} ${fieldCls("confirm")} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0E6BA8] transition-colors"
                >
                  {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {touched.confirm && errors.confirm && (
                <p className="text-red-500 text-[11px] mt-1">{errors.confirm}</p>
              )}
            </div>

            {/* Info box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              Tras registrarte, tu cuenta quedará <strong>pendiente de aprobación</strong>. Un auditor la revisará antes de que puedas ingresar.
            </div>

            <button
              type="submit"
              disabled={loading || !isValid}
              className="w-full py-3 bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] hover:from-[#144272] hover:to-[#00ACC1]
                text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-900/25
                transition-all duration-200 hover:shadow-xl active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><FiLoader className="animate-spin" size={16} /> Creando cuenta...</>
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
