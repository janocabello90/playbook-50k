// Notifica a la Academia FisioReferentes (knaas.vercel.app) para que invite
// al lead a crear su cuenta gratuita. Esta llamada se hace SIEMPRE desde el
// servidor: la API key no debe llegar nunca al navegador del usuario.

import { splitFullName } from './name';

const ACADEMIA_LEAD_API_URL = "https://knaas.vercel.app/api/external/playbook-lead";

// Timeout defensivo: si la Academia tarda o no responde, no queremos dejar
// la petición del usuario colgada esperando indefinidamente.
const ACADEMIA_TIMEOUT_MS = 8000;

type NotifyAcademiaResult =
  | { ok: true; outcome: "invited" | "existing_user_notified" }
  | { ok: false; error: string };

export async function notifyAcademia(email: string, fullName: string): Promise<NotifyAcademiaResult> {
  const apiKey = process.env.PLAYBOOK_LEADS_API_KEY;

  if (!apiKey) {
    console.error("PLAYBOOK_LEADS_API_KEY no está configurada. No se puede invitar al lead a la Academia.");
    return { ok: false, error: "PLAYBOOK_LEADS_API_KEY no configurada" };
  }

  const { firstName, lastName: rawLastName } = splitFullName(fullName);
  // La Academia exige firstName y lastName como campos no vacíos. Si no hay
  // apellido mandamos "-" en vez de "" — de lo contrario la API responde
  // 400 y el lead nunca llega a invitarse.
  const lastName = rawLastName || '-';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ACADEMIA_TIMEOUT_MS);

  try {
    const response = await fetch(ACADEMIA_LEAD_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ email, firstName, lastName }),
      signal: controller.signal,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(
        `Academia: no se pudo invitar a ${email} (HTTP ${response.status})`,
        result
      );
      return { ok: false, error: result?.error || `HTTP ${response.status}` };
    }

    console.log(`Academia: lead invitado correctamente (${result?.outcome}) — ${email}`);
    return { ok: true, outcome: result?.outcome };
  } catch (error: any) {
    const reason = error?.name === "AbortError" ? "timeout" : error?.message || "error de red";
    console.error(`Academia: fallo al invitar a ${email}: ${reason}`);
    return { ok: false, error: reason };
  } finally {
    clearTimeout(timeoutId);
  }
}
