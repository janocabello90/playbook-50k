/**
 * Script para crear usuarios administradores
 * 
 * USO:
 *   node scripts/create-admin.js --username admin --password tu_contraseña_segura
 * 
 * O con variables de entorno:
 *   ADMIN_USERNAME=admin ADMIN_PASSWORD=tu_contraseña node scripts/create-admin.js
 * 
 * SEGURIDAD:
 *   Este script solo debe ejecutarse desde el servidor, nunca desde el navegador.
 *   No exponer esta funcionalidad en rutas públicas.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs').default || require('bcryptjs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno de Supabase');
  console.error('   Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY configuradas');
  process.exit(1);
}

// Usar service role key para tener permisos completos
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  // Obtener username y password de argumentos o variables de entorno
  const args = process.argv.slice(2);
  let username = process.env.ADMIN_USERNAME;
  let password = process.env.ADMIN_PASSWORD;

  // Parsear argumentos de línea de comandos
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--username' && args[i + 1]) {
      username = args[i + 1];
      i++;
    } else if (args[i] === '--password' && args[i + 1]) {
      password = args[i + 1];
      i++;
    }
  }

  if (!username || !password) {
    console.error('❌ Error: Usuario y contraseña requeridos');
    console.error('');
    console.error('Uso:');
    console.error('  node scripts/create-admin.js --username admin --password tu_contraseña');
    console.error('');
    console.error('O con variables de entorno:');
    console.error('  ADMIN_USERNAME=admin ADMIN_PASSWORD=contraseña node scripts/create-admin.js');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ Error: La contraseña debe tener al menos 8 caracteres');
    process.exit(1);
  }

  try {
    console.log('🔐 Creando usuario administrador...');
    console.log(`   Usuario: ${username}`);

    // Hash de la contraseña
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) reject(err);
        else resolve(hash);
      });
    });

    // Verificar si ya existe un admin con ese username
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 es "no rows returned", que es esperado si no existe
      throw checkError;
    }

    if (existingAdmin) {
      console.log(`⚠️  El usuario "${username}" ya existe. Actualizando contraseña...`);
      
      const { error: updateError } = await supabase
        .from('admins')
        .update({ password: hashedPassword })
        .eq('username', username);

      if (updateError) {
        throw updateError;
      }

      console.log('✅ Contraseña actualizada correctamente.');
    } else {
      // Crear nuevo admin
      const { error: insertError } = await supabase
        .from('admins')
        .insert([{ username, password: hashedPassword }]);

      if (insertError) {
        throw insertError;
      }

      console.log('✅ Usuario administrador creado correctamente.');
    }

    console.log('');
    console.log('📋 Credenciales:');
    console.log(`   Usuario: ${username}`);
    console.log(`   Contraseña: ${password}`);
    console.log('');
    console.log('⚠️  IMPORTANTE: Guarda estas credenciales en un lugar seguro.');
    console.log('   Cambia la contraseña después del primer login si es necesario.');
    console.log('');
    console.log('🔗 Accede al panel en: http://localhost:3000/admin');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error.message || error);
    process.exit(1);
  }
}

createAdmin();
