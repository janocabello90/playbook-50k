import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { notifyAcademia } from '@/lib/academia';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, revenue, challenge } = body;

    // Validar campos requeridos (el teléfono ya no se pide en el formulario)
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos: name, email' },
        { status: 400 }
      );
    }

    // Guardar el lead en Supabase.
    // La columna "phone" ya no se recoge en el formulario, pero se mantiene
    // NOT NULL en la tabla: usamos un valor de relleno en vez de null.
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name,
          phone: '1',
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