# client-patient-gesap

Portal de pacientes del Sistema GESAP. Permite a los pacientes registrarse, consultar su expediente médico, gestionar contactos de emergencia y usar el asistente de IA.

## Stack

- React 18 + TypeScript
- Vite + Tailwind CSS v4
- Zustand (estado global, persistido en localStorage)
- Axios (cliente HTTP)
- React Router v6

## Puerto de desarrollo

```
http://localhost:5176
```

## Instalación y desarrollo

```bash
pnpm install    # o npm install
pnpm dev        # http://localhost:5176
```

Requiere que **gesap-patient-portal** esté corriendo en `localhost:3002`.

## Páginas disponibles

| Ruta | Descripción |
|------|-------------|
| `/register` | Registro de nueva cuenta (libre, sin verificación DPI) |
| `/login` | Inicio de sesión |
| `/dashboard` | Resumen del perfil y estado de la cuenta |
| `/profile` | Consulta y edición del perfil |
| `/emergency-contacts` | Gestión de contactos de emergencia (máx. 5) |
| `/history` | Historial de expedientes médicos y tratamientos |
| `/my-emergencies` | Emergencias en las que el paciente fue atendido |
| `/ai` | Asistente médico con IA (Groq / Llama 3) |

## Proxy de desarrollo (Vite)

No requiere `.env` — el proxy de Vite redirige automáticamente:

| Path | Destino |
|------|---------|
| `/gesap-portal/v1/*` | `http://localhost:3002` (gesap-patient-portal) |

## Build de producción

```bash
pnpm build
# Genera dist/ con base en / (raíz del dominio gesap.lat)
# Copiar a www/client-patient/ en el servidor para que nginx lo sirva
```

## Flujo de registro

1. El paciente se registra con DPI y correo — cuenta queda en estado `PENDING`
2. Un auditor aprueba la cuenta desde el panel de auditoría (`/auditor/mantenimiento`)
3. El paciente puede iniciar sesión una vez aprobado

## Estructura principal

```
src/
├── features/
│   ├── auth/               # Login, Register, ProtectedRoute
│   ├── profile/
│   ├── emergency-contacts/
│   ├── history/
│   ├── my-emergencies/
│   └── ai/
└── shared/
    ├── api/                # Cliente axios + funciones por módulo
    └── components/layouts/ # MainLayout, Sidebar, Navbar (responsive)
```
