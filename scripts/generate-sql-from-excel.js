const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Leer el archivo Excel
const excelPath = path.join(__dirname, '../public/Formularios 0-50K.xlsx');
const workbook = XLSX.readFile(excelPath);

// Obtener la primera hoja
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convertir a JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`📊 Total de filas encontradas en Excel: ${data.length}`);
console.log(`📋 Columnas encontradas:`, Object.keys(data[0] || {}));
console.log('\n');

// Función para escapar comillas simples en SQL
function escapeSQL(str) {
  if (!str || str === null || str === undefined) return null;
  return String(str).replace(/'/g, "''");
}

// Función para formatear valores SQL
function formatSQLValue(value) {
  if (value === null || value === undefined || value === '') {
    return 'NULL';
  }
  return `'${escapeSQL(value)}'`;
}

// Generar SQL INSERT statements
let sqlStatements = [];
let batchSize = 100; // Insertar en lotes de 100

// Mapear columnas del Excel a columnas de la base de datos
// Ajusta estos nombres según las columnas reales de tu Excel
const columnMapping = {
  // Ejemplos comunes - AJUSTA SEGÚN TU EXCEL
  'Nombre': 'name',
  'nombre': 'name',
  'Name': 'name',
  'Email': 'email',
  'email': 'email',
  'E-mail': 'email',
  'Teléfono': 'phone',
  'telefono': 'phone',
  'Phone': 'phone',
  'Teléfono/Móvil': 'phone',
  'Clínica': 'clinic',
  'clinic': 'clinic',
  'Clinic': 'clinic',
  'Clínica y ciudad': 'clinic',
  'Facturación': 'revenue',
  'facturación': 'revenue',
  'Revenue': 'revenue',
  'Facturación anual': 'revenue',
  'Reto': 'challenge',
  'reto': 'challenge',
  'Challenge': 'challenge',
  'Mayor reto': 'challenge',
  'Fecha': 'created_at',
  'fecha': 'created_at',
  'Date': 'created_at',
  'Fecha de registro': 'created_at',
};

// Función para mapear columnas
function mapColumn(excelColumn) {
  return columnMapping[excelColumn] || excelColumn.toLowerCase();
}

// Procesar cada fila y agrupar por email (mantener solo el más reciente)
const leadsMap = new Map();

data.forEach((row, index) => {
  // Extraer valores según el mapeo
  const name = row['Nombre'] || row['nombre'] || row['Name'] || '';
  const email = row['Email'] || row['email'] || row['E-mail'] || '';
  const phone = row['Teléfono'] || row['telefono'] || row['Phone'] || row['Teléfono/Móvil'] || row['Móvil'] || 'Sin teléfono';
  const clinic = row['Clínica'] || row['clinic'] || row['Clinic'] || row['Clínica y ciudad'] || null;
  const revenue = row['Facturación'] || row['facturación'] || row['Revenue'] || row['Facturación anual'] || null;
  const challenge = row['Reto'] || row['reto'] || row['Challenge'] || row['Mayor reto'] || null;
  
  // Validar campos requeridos (solo name y email, phone puede ser opcional)
  if (!name || !email) {
    console.warn(`⚠️  Fila ${index + 2} omitida: faltan campos requeridos (name, email)`);
    return;
  }

  // Fecha - intentar parsear si existe
  let date = new Date();
  const dateValue = row['Fecha'] || row['fecha'] || row['Date'] || row['Fecha de registro'];
  if (dateValue) {
    try {
      // Si es un número de Excel (días desde 1900), convertirlo
      if (typeof dateValue === 'number') {
        // Excel cuenta días desde 1900-01-01
        const excelEpoch = new Date(1899, 11, 30);
        date = new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
      } else {
        date = new Date(dateValue);
      }
      if (isNaN(date.getTime())) {
        date = new Date();
      }
    } catch (e) {
      // Si no se puede parsear, usar fecha actual
      date = new Date();
    }
  }

  const emailLower = email.toLowerCase().trim();
  
  // Si ya existe este email, comparar fechas y mantener el más reciente
  if (leadsMap.has(emailLower)) {
    const existing = leadsMap.get(emailLower);
    if (date > existing.date) {
      // Este registro es más reciente, reemplazar
      leadsMap.set(emailLower, { name, phone, email, clinic, revenue, challenge, date });
    }
    // Si el existente es más reciente, no hacer nada
  } else {
    // Nuevo email, añadir
    leadsMap.set(emailLower, { name, phone, email, clinic, revenue, challenge, date });
  }
});

// Generar SQL solo con los registros únicos (más recientes)
leadsMap.forEach((lead) => {
  const createdAt = `'${lead.date.toISOString()}'`;
  const sql = `INSERT INTO leads (name, phone, email, clinic, revenue, challenge, status, created_at) VALUES (${formatSQLValue(lead.name)}, ${formatSQLValue(lead.phone)}, ${formatSQLValue(lead.email)}, ${formatSQLValue(lead.clinic)}, ${formatSQLValue(lead.revenue)}, ${formatSQLValue(lead.challenge)}, 'LEAD', ${createdAt});`;
  sqlStatements.push(sql);
});

// Generar archivo SQL
const sqlContent = `-- SQL generado desde: Formularios 0-50K.xlsx
-- Total de registros únicos (sin duplicados por email): ${sqlStatements.length}
-- Fecha de generación: ${new Date().toISOString()}
-- Nota: Se han eliminado duplicados por email, manteniendo solo el registro más reciente

-- IMPORTANTE: Revisa los datos antes de ejecutar

${sqlStatements.join('\n')}
`;

// Guardar en archivo
const outputPath = path.join(__dirname, '../import-leads.sql');
fs.writeFileSync(outputPath, sqlContent, 'utf8');

console.log(`✅ SQL generado exitosamente!`);
console.log(`📄 Archivo guardado en: ${outputPath}`);
console.log(`📊 Total de INSERT statements: ${sqlStatements.length}`);
console.log(`\n💡 Siguiente paso:`);
console.log(`   1. Revisa el archivo ${outputPath}`);
console.log(`   2. Ajusta los nombres de columnas si es necesario`);
console.log(`   3. Copia y pega el SQL en Supabase SQL Editor`);
console.log(`\n⚠️  NOTA: Si hay emails duplicados, considera usar:`);
console.log(`   INSERT INTO leads (...) VALUES (...) ON CONFLICT (email) DO NOTHING;`);
