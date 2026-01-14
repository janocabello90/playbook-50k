import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Función helper para verificar autenticación
function isAuthenticated(request: NextRequest): boolean {
  const authCookie = request.cookies.get('admin-auth');
  return authCookie?.value === 'authenticated';
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener todos los leads ordenados por fecha más reciente
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      leads: leads || [],
    });
  } catch (error) {
    console.error('Error al obtener leads:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener los leads' },
      { status: 500 }
    );
  }
}