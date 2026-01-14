import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Función helper para verificar autenticación
function isAuthenticated(request: NextRequest): boolean {
  const authCookie = request.cookies.get('admin-auth');
  return authCookie?.value === 'authenticated';
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Verificar autenticación
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, notes } = body;

    // Manejar params que puede ser Promise o objeto directo (compatibilidad Next.js 14/15)
    const resolvedParams = params instanceof Promise ? await params : params;
    const leadId = parseInt(resolvedParams.id);

    // Preparar los datos a actualizar
    const updateData: { status?: string; notes?: string | null } = {};
    
    if (status !== undefined) {
      updateData.status = status;
    }
    
    if (notes !== undefined) {
      updateData.notes = notes || null;
    }

    // Si no hay nada que actualizar
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No hay datos para actualizar' },
        { status: 400 }
      );
    }

    // Actualizar el lead
    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      console.error('Error de Supabase al actualizar lead:', error);
      return NextResponse.json(
        { success: false, error: `Error de Supabase: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lead: data,
    });
  } catch (error: any) {
    console.error('Error al actualizar lead:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || 'Error al actualizar el lead',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}
