import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { notifyAcademia } from '@/lib/academia';
import { addToActiveCampaign } from '@/lib/activecampaign';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, phone, email, revenue, challenge } = body;

    // Validar campos requeridos
    if (!name || !phone || !email) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos: name, phone, email' },
        { status: 400 }
      );
    }

    // Guardar el lead en Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name,
          phone,
          email,
          revenue: revenue || null,
          challenge: challenge || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error al guardar lead:', error);
      return NextResponse.json(
        { success: false, error: 'Error al guardar el lead' },
        { status: 500 }
      );
    }

    // Invitar al lead a la Academia FisioReferentes (knaas.vercel.app).
    // Es su API la que envía el email de acceso; si falla, lo logueamos
    // pero no hacemos fallar el guardado del lead.
    const academiaResult = await notifyAcademia(email, name);
    if (!academiaResult.ok) {
      console.error('⚠️ No se pudo invitar al lead a la Academia (no crítico):', academiaResult.error);
    }

    // Dar de alta al lead en ActiveCampaign (lista Playbook 150K). Si falla,
    // lo logueamos pero no hacemos fallar el guardado del lead.
    const activeCampaignResult = await addToActiveCampaign(email, name, phone);
    if (!activeCampaignResult.ok) {
      console.error('⚠️ No se pudo dar de alta el lead en ActiveCampaign (no crítico):', activeCampaignResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Lead guardado correctamente',
      id: data.id,
    });
  } catch (error) {
    console.error('Error al guardar lead:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar el lead' },
      { status: 500 }
    );
  }
}