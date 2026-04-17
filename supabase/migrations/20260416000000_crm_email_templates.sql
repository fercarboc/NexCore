-- ─────────────────────────────────────────────────────────────────────────────
-- crm_email_templates
-- Plantillas de email de marketing / dossiers para el CRM de NexCore
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS crm_email_templates (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  description  TEXT,
  category     TEXT        NOT NULL DEFAULT 'marketing'
                           CHECK (category IN ('marketing', 'dossier', 'info', 'followup')),
  subject      TEXT        NOT NULL,
  body         TEXT        NOT NULL,  -- HTML completo
  thumbnail_url TEXT,                 -- URL de imagen de preview (opcional)
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_crm_email_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_crm_email_templates_updated_at
  BEFORE UPDATE ON crm_email_templates
  FOR EACH ROW EXECUTE FUNCTION update_crm_email_templates_updated_at();

-- RLS: solo staff autenticado puede leer/modificar
ALTER TABLE crm_email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff_read_templates"
  ON crm_email_templates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff_profiles
      WHERE id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "staff_write_templates"
  ON crm_email_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM staff_profiles
      WHERE id = auth.uid() AND status = 'active'
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Plantillas por defecto
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO crm_email_templates (name, description, category, subject, body, thumbnail_url) VALUES

-- 1. Dossier de producto
(
  'Dossier StayNexApp',
  'Presentación completa del producto con imagen de marca, características principales y llamada a la acción para solicitar demo.',
  'dossier',
  '🏡 Descubre StayNexApp – La plataforma que transforma tu negocio de alojamiento rural',
  '<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;">

    <!-- Header con imagen de producto -->
    <div style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:0;border-radius:16px 16px 0 0;overflow:hidden;">
      <img src="https://nexcore.staynexapp.com/images/og-image.png"
           alt="StayNexApp" style="width:100%;display:block;" />
    </div>

    <!-- Cuerpo principal -->
    <div style="background:#ffffff;padding:40px 36px;">
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#0f172a;line-height:1.2;">
        Hola, {{nombre}} 👋
      </h1>
      <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
        Somos el equipo de <strong style="color:#4f46e5;">StayNexApp</strong> y queremos presentarte la solución
        que ya usan cientos de propietarios rurales para gestionar sus reservas, clientes y pagos desde un único lugar.
      </p>

      <hr style="border:none;border-top:1px solid #f1f5f9;margin:0 0 28px;" />

      <!-- Features grid -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" style="padding:0 8px 20px 0;vertical-align:top;">
            <div style="background:#f8fafc;border-radius:12px;padding:20px;">
              <div style="font-size:24px;margin-bottom:8px;">📅</div>
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#0f172a;">Reservas online</p>
              <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">
                Motor de reservas directo integrado en tu web, sin comisiones de intermediarios.
              </p>
            </div>
          </td>
          <td width="50%" style="padding:0 0 20px 8px;vertical-align:top;">
            <div style="background:#f8fafc;border-radius:12px;padding:20px;">
              <div style="font-size:24px;margin-bottom:8px;">💳</div>
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#0f172a;">Pagos integrados</p>
              <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">
                Acepta pagos con tarjeta, Bizum y transferencia. Tu dinero, a tu cuenta directamente.
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td width="50%" style="padding:0 8px 0 0;vertical-align:top;">
            <div style="background:#f8fafc;border-radius:12px;padding:20px;">
              <div style="font-size:24px;margin-bottom:8px;">📊</div>
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#0f172a;">Panel de control</p>
              <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">
                Dashboard con métricas en tiempo real: ocupación, ingresos y satisfacción de huéspedes.
              </p>
            </div>
          </td>
          <td width="50%" style="padding:0 0 0 8px;vertical-align:top;">
            <div style="background:#f8fafc;border-radius:12px;padding:20px;">
              <div style="font-size:24px;margin-bottom:8px;">🌐</div>
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#0f172a;">Web incluida</p>
              <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">
                Web profesional con tu dominio personalizado lista en minutos, sin programar.
              </p>
            </div>
          </td>
        </tr>
      </table>

      <!-- CTA -->
      <div style="text-align:center;margin:36px 0 0;">
        <a href="https://staynexapp.com"
           style="display:inline-block;background:#4f46e5;color:#ffffff;font-size:14px;font-weight:700;
                  padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:0.3px;">
          Solicitar demo gratuita →
        </a>
        <p style="margin:16px 0 0;font-size:11px;color:#94a3b8;">
          Sin compromiso · Configuración en 24 h · Soporte incluido
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:24px 36px;border-radius:0 0 16px 16px;text-align:center;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#4f46e5;">StayNexApp</p>
      <p style="margin:0;font-size:11px;color:#94a3b8;">
        ¿Preguntas? Responde a este email o escríbenos a <a href="mailto:contacto@staynexapp.com" style="color:#4f46e5;">contacto@staynexapp.com</a>
      </p>
    </div>

  </div>
</body>
</html>',
  'https://nexcore.staynexapp.com/images/og-image.png'
),

-- 2. Invitación a demo
(
  'Invitación a Demo',
  'Email de invitación a demo personalizada. Incluye confirmación de la reunión y enlace de agenda.',
  'marketing',
  '¿Tienes 30 minutos? Te mostramos StayNexApp en acción 🎯',
  '<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;">

    <!-- Header minimalista -->
    <div style="background:#0f172a;padding:32px 36px;border-radius:16px 16px 0 0;text-align:center;">
      <p style="margin:0;font-size:13px;font-weight:700;color:#818cf8;letter-spacing:2px;text-transform:uppercase;">StayNexApp</p>
      <h1 style="margin:12px 0 0;font-size:22px;font-weight:800;color:#ffffff;">Demo personalizada</h1>
    </div>

    <!-- Cuerpo -->
    <div style="background:#ffffff;padding:40px 36px;">
      <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
        Hola, <strong>{{nombre}}</strong>,
      </p>
      <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
        Gracias por tu interés en <strong>StayNexApp</strong>. Me gustaría mostrarte cómo la plataforma
        puede adaptarse exactamente a tu negocio de alojamiento rural en una videollamada de <strong>30 minutos</strong>.
      </p>
      <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.7;">
        En la demo veremos:
      </p>
      <ul style="margin:0 0 28px;padding:0 0 0 20px;color:#374151;font-size:14px;line-height:2;">
        <li>Motor de reservas online para tu alojamiento</li>
        <li>Panel de gestión: calendario, huéspedes y pagos</li>
        <li>Configuración de tu web en menos de 15 minutos</li>
        <li>Respuesta a todas tus preguntas</li>
      </ul>

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0;">
        <a href="https://staynexapp.com/demo"
           style="display:inline-block;background:#4f46e5;color:#ffffff;font-size:14px;font-weight:700;
                  padding:14px 32px;border-radius:10px;text-decoration:none;">
          Reservar mi demo gratuita
        </a>
      </div>

      <p style="margin:24px 0 0;font-size:13px;color:#64748b;line-height:1.6;">
        Si prefieres que te llame directamente, responde a este email con tu número y horario preferido.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:24px 36px;border-radius:0 0 16px 16px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#94a3b8;">
        StayNexApp · <a href="mailto:contacto@staynexapp.com" style="color:#4f46e5;">contacto@staynexapp.com</a>
      </p>
    </div>
  </div>
</body>
</html>',
  NULL
),

-- 3. Seguimiento de lead
(
  'Seguimiento de Lead',
  'Email de seguimiento para leads que no han respondido. Tono cercano y sin presión.',
  'followup',
  '¿Pudiste echarle un vistazo a la información? 👀',
  '<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;">

    <div style="background:#ffffff;padding:40px 36px;border-radius:16px;">
      <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
        Hola, <strong>{{nombre}}</strong> 👋
      </p>
      <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
        Te escribo de nuevo por si no llegaste a ver el email que te enviamos hace unos días sobre
        <strong>StayNexApp</strong>.
      </p>
      <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
        Si tienes alguna duda o simplemente quieres saber si encaja con tu negocio, estaré encantado/a de
        aclararlo sin ningún compromiso.
      </p>
      <p style="margin:0 0 32px;font-size:15px;color:#374151;line-height:1.7;">
        ¿Te viene bien que hablemos esta semana?
      </p>

      <div style="background:#f8fafc;border-left:4px solid #4f46e5;padding:16px 20px;border-radius:0 8px 8px 0;">
        <p style="margin:0;font-size:13px;color:#374151;line-height:1.6;">
          Responde directamente a este email o escríbenos a
          <a href="mailto:contacto@staynexapp.com" style="color:#4f46e5;font-weight:600;">contacto@staynexapp.com</a>.
          Respondemos en menos de 24 h.
        </p>
      </div>

      <p style="margin:28px 0 0;font-size:13px;color:#94a3b8;">Un saludo,<br>El equipo de StayNexApp</p>
    </div>

  </div>
</body>
</html>',
  NULL
);
