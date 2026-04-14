# Arquitectura NexCore — Decisiones Técnicas Confirmadas
**Versión 3 · Actualizado: Abril 2026**

---

## 1. Visión General del Sistema

NexCore es el **backoffice SaaS centralizado** de StayNexApp. Gestiona clientes, planes, facturación y soporte. Los clientes (propietarios rurales) trabajan en **casarural-v2**, que es el producto que consumen.

```
┌─────────────────────────────────────────────────────────────┐
│                     STAYNEXAPP ECOSYSTEM                     │
├─────────────────┬───────────────────┬───────────────────────┤
│   NEXCORE        │   CASARURAL-V2    │   DEBACU              │
│   (SUPABASE-B)   │   (SUPABASE-A)    │   (SUPABASE-C)        │
│                  │                   │                       │
│  Staff backoffice│  Producto cliente │  API de riesgo/IA     │
│  Planes / Billing│  Web pública      │  Verificación usuario │
│  Soporte / CRM   │  Motor reservas   │  Análisis predictivo  │
│  Clientes SaaS   │  Unidades alquil. │                       │
└─────────────────┴───────────────────┴───────────────────────┘
```

**Regla fundamental:** NexCore es la fuente de verdad de planes, límites y estado de suscripción. casarural-v2 nunca decide planes ni límites propios.

---

## 2. Proyectos Supabase

| Proyecto | ID | Uso |
|---|---|---|
| NexCore (SUPABASE-B) | `hlcyumeolkhmcdjqqopt` | Staff backoffice, billing, CRM |
| casarural-v2 (SUPABASE-A) | `uxplvlbqwwnjtterrzqz` | Producto cliente, reservas, propiedades |

---

## 3. Autenticación — Separación de roles

### Staff (NexCore)
- Login: `admin@staynexapp.com` → `supabase.auth` de SUPABASE-B
- Tabla: `staff_profiles` (id = auth.users.id, rol, status)
- Acceso exclusivo al backoffice NexCore
- Los clientes **nunca** entran en NexCore

### Clientes (casarural-v2)
- Login único: email + password en `supabase.auth` de SUPABASE-A
- Creados mediante `auth.admin.inviteUserByEmail()` desde NexCore al hacer el alta
- Reciben **un único email** de bienvenida con magic link para establecer contraseña
- Entran directamente en casarural-v2 (nunca ven NexCore)

### Vinculación entre entornos
```
saas_clients (NexCore BD)
  ├── id                    → UUID en NexCore
  ├── casarural_user_id     → auth.users.id en SUPABASE-A
  └── casarural_property_id → properties.id en SUPABASE-A (se rellena en onboarding)
```

---

## 4. Arquitectura de Datos — Reglas fijas

### Todo acceso a datos via Edge Functions
- **CERO** queries directas `.from('tabla').select()` desde el frontend
- **CERO** llamadas `.rpc()` directas
- Toda lectura/escritura → `supabase.functions.invoke('nombre-funcion')`
- Las Edge Functions verifican JWT interno + `staff_profiles` activo

### Convenciones de BD
- Status enums en **UPPERCASE**: `ACTIVE`, `SUSPENDED`, `CANCELLED`
- Cantidades monetarias en **céntimos** (integer): `monthly_price_cents`
- Timestamps en **ISO 8601** con timezone

---

## 5. Stripe — Dos flujos completamente independientes

### 5A. Stripe SaaS (NexCore) — Cobra los planes a clientes

```
Cliente paga su plan mensual/anual
    → Stripe account de StayNexApp
    → Gestionado en NexCore
```

| Plan | Precio mensual | Precio anual | Stripe Product |
|---|---|---|---|
| Basic | 29€ | 290€ | `prod_UKKjyK7azRzqtg` |
| Pro | 79€ | 790€ | `prod_UKKjzUW8weVWQV` |
| Premium | 149€ | 1.490€ | `prod_UKKjpgoS7CpCdU` |
| Enterprise | 299€ | 2.990€ | `prod_UKKjcISjjqaLqY` |

**API Key NexCore Stripe:** `sk_test_51TL2F0AA...` (guardado como secret en Edge Functions)

### 5B. Stripe Connect (casarural-v2) — El cliente cobra a sus huéspedes

```
Huésped paga una reserva
    → Stripe Connect account del propietario
    → Dinero va directo al propietario
    → StayNex puede aplicar fee de plataforma
    → Gestionado en casarural-v2 (panel del cliente)
```

**Tabla en casarural-v2:** `properties`
- `stripe_account_id` → Connect account ID del propietario
- `stripe_onboarding_complete` → si completó el proceso
- `stripe_charges_enabled` → puede cobrar
- `stripe_payouts_enabled` → puede recibir pagos

**Dónde se conecta:** En el panel de gestión de casarural-v2. El cliente accede a "Cobros" → "Conectar con Stripe" → flujo OAuth de Stripe Connect → StayNex como plataforma.

**NexCore puede ver** el estado Connect de cada cliente (lectura en `ClientDetailPage`), pero el alta del Connect Account la gestiona casarural-v2.

---

## 6. Proceso de Alta de Cliente (Wizard NexCore)

El staff ejecuta este wizard en NexCore. Pasos automáticos:

```
PASO 1 — Datos del cliente (UI)
  Razón social, nombre comercial, contacto, email, CIF

PASO 2 — Plan y ciclo (UI)
  Basic/Pro/Premium/Enterprise + Mensual/Anual

PASO 3 — Confirmación (UI)
  Resumen antes de ejecutar

EJECUCIÓN (Edge Function: create-client)
  1. Crear Customer en Stripe (NexCore Stripe)
  2. Crear Subscription en Stripe con price_id del plan
  3. Crear auth.user en casarural-v2 via inviteUserByEmail()
  4. INSERT saas_clients en NexCore BD (con casarural_user_id)
  5. INSERT saas_subscriptions en NexCore BD
  6. Email automático a cliente: magic link para establecer contraseña
```

**El cliente recibe:** Un único email con enlace directo a casarural-v2 para configurar su contraseña y comenzar el onboarding de su propiedad.

---

## 7. Onboarding del Cliente en casarural-v2

Después del alta en NexCore, el cliente en casarural-v2:

```
1. Recibe email → establece contraseña → entra en casarural-v2
2. Onboarding guiado:
   a. Crea su propiedad (nombre, ubicación, etc.)
   b. Configura su web pública
   c. Añade sus unidades alquilables
   d. Conecta Stripe Connect (para cobrar reservas)
   e. Configura motor de reservas (precios, disponibilidad)
3. Su panel muestra el plan activo (consultado a NexCore)
4. Puede cambiar plan / cancelar (llama a Edge Functions de NexCore)
```

**Tabla clave:** `properties.onboarding_done = false` hasta completar el setup.

---

## 8. CRM (reemplaza "Bandeja de Entrada")

Tablas ya existentes en NexCore BD:

| Tabla | Contenido |
|---|---|
| `crm_contacts` | Personas que contactaron vía staynexapp.com |
| `crm_leads` | Solicitudes de demo/info (tipo, plan interesado, origen) |
| `crm_emails` | Emails enviados/recibidos con cada contacto/lead |
| `crm_events` | Eventos de tracking (visitas web, clics, etc.) |

**Funcionalidades previstas:**
- Ver todos los leads entrantes de www.staynexapp.com
- Seguimiento del pipeline (nuevo → contactado → demo → cliente)
- Enviar emails de respuesta individual desde NexCore
- Campañas de email masivo a clientes activos (novedades, ofertas)
- Convertir lead a cliente con el wizard de alta

---

## 9. Edge Functions desplegadas (NexCore)

| Función | Descripción |
|---|---|
| `get-clients` | Lista clientes con suscripción y plan |
| `get-invoices` | Facturas, filtrable por client_id |
| `get-tickets` | Tickets de soporte, filtrable por client_id |
| `get-ticket-events` | Eventos/timeline de un ticket |
| `get-staff` | Perfiles de staff + email/último acceso de auth.users |
| `get-plans` | Planes disponibles con Stripe IDs |
| `get-integrations` | Integraciones de plataforma |
| `create-client` | **Alta completa**: Stripe + casarural-v2 + NexCore BD |

Todas con `verify_jwt: false` + verificación interna via `auth.getUser()` + `staff_profiles`.

---

## 10. Secrets configurados en NexCore Edge Functions

| Secret | Valor |
|---|---|
| `SUPABASE_URL` | Auto-inyectado por Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-inyectado por Supabase |
| `STRIPE_SECRET_KEY` | `sk_test_51TL2F0AA...` |
| `CASARURAL_URL` | `https://uxplvlbqwwnjtterrzqz.supabase.co` |
| `CASARURAL_SERVICE_ROLE_KEY` | `eyJhbGci...` |

---

## 11. Pendiente de implementar

- [ ] Módulo CRM completo (reemplazar "Bandeja de Entrada")
- [ ] Cambio de plan desde NexCore (Edge Function `update-subscription`)
- [ ] Cancelación de suscripción (Edge Function `cancel-subscription`)
- [ ] Webhook Stripe → NexCore (actualizar estado de facturas/suscripciones)
- [ ] Vista del plan activo en panel casarural-v2 (consulta a NexCore)
- [ ] PlansPage conectada a datos reales
- [ ] Gráficos MRR histórico (tabla `mrr_snapshots` o agregación de facturas)
