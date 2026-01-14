import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendOnboardingEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, phone, email, clinic, revenue, challenge } = body;

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
          clinic: clinic || null,
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

    // Enviar email de onboarding (no bloquea la respuesta si falla)
    try {
      const emailResult = await sendOnboardingEmail(email, name);
      if (!emailResult.success) {
        console.error('⚠️ Email no enviado (no crítico):', emailResult.error);
      }
    } catch (emailError) {
      // Log del error pero no fallamos la petición
      console.error('⚠️ Error al enviar email de onboarding (no crítico):', emailError);
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