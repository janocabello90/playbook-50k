// Da de alta (o actualiza) al lead en ActiveCampaign y lo suscribe a la
// lista del Playbook 150K. Esta llamada se hace SIEMPRE desde el servidor:
// la API key no debe llegar nunca al navegador del usuario.

import { splitFullName } from './name';

// Lista de ActiveCampaign creada para este embudo (Playbook 150K).
const ACTIVECAMPAIGN_LIST_ID = 17;

// Timeout defensivo: si ActiveCampaign tarda o no responde, no queremos
// dejar la petición del usuario colgada esperando indefinidamente.
const ACTIVECAMPAIGN_TIMEOUT_MS = 8000;

type AddToActiveCampaignResult = { ok: true } | { ok: false; error: string };

export async function addToActiveCampaign(
  email: string,
  fullName: string,
  phone: string
): Promise<AddToActiveCampaignResult> {
  const apiUrl = process.env.ACTIVECAMPAIGN_API_URL;
  const apiKey = process.env.ACTIVECAMPAIGN_API_KEY;

  if (!apiUrl || !apiKey) {
    console.error('ACTIVECAMPAIGN_API_URL / ACTIVECAMPAIGN_API_KEY no configuradas. No se puede dar de alta el lead en ActiveCampaign.');
    return { ok: false, error: 'ActiveCampaign no configurado' };
  }

  const { firstName, lastName } = splitFullName(fullName);
  const baseUrl = apiUrl.replace(/\/+$/, '');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ACTIVECAMPAIGN_TIMEOUT_MS);

  try {
    // 1. Crear o actualizar el contacto (upsert por email).
    const syncResponse = await fetch(`${baseUrl}/api/3/contact/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Token': apiKey,
      },
      body: JSON.stringify({
        contact: { email, firstName, lastName, phone },
      }),
      signal: controller.signal,
    });

    const syncResult = await syncResponse.json().catch(() => null);

    if (!syncResponse.ok) {
      console.error(
        `ActiveCampaign: no se pudo crear/actualizar el contacto ${email} (HTTP ${syncResponse.status})`,
        syncResult
      );
      return { ok: false, error: syncResult?.message || `HTTP ${syncResponse.status}` };
    }

    const contactId = syncResult?.contact?.id;
    if (!contactId) {
      console.error(`ActiveCampaign: respuesta sin contact.id para ${email}`, syncResult);
      return { ok: false, error: 'Respuesta sin contact.id' };
    }

    // 2. Suscribirlo a la lista del Playbook 150K.
    const listResponse = await fetch(`${baseUrl}/api/3/contactLists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Token': apiKey,
      },
      body: JSON.stringify({
        contactList: {
          list: ACTIVECAMPAIGN_LIST_ID,
          contact: contactId,
          status: 1, // 1 = activo/suscrito
        },
      }),
      signal: controller.signal,
    });

    const listResult = await listResponse.json().catch(() => null);

    if (!listResponse.ok) {
      console.error(
        `ActiveCampaign: no se pudo suscribir a la lista ${ACTIVECAMPAIGN_LIST_ID} el contacto ${email} (HTTP ${listResponse.status})`,
        listResult
      );
      return { ok: false, error: listResult?.message || `HTTP ${listResponse.status}` };
    }

    console.log(`ActiveCampaign: lead ${email} creado/actualizado y suscrito a la lista ${ACTIVECAMPAIGN_LIST_ID}`);
    return { ok: true };
  } catch (error: any) {
    const reason = error?.name === 'AbortError' ? 'timeout' : error?.message || 'error de red';
    console.error(`ActiveCampaign: fallo al procesar a ${email}: ${reason}`);
    return { ok: false, error: reason };
  } finally {
    clearTimeout(timeoutId);
  }
}
