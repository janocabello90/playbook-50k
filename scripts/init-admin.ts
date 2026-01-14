import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Verificar si ya existe un admin
  const existingAdmin = await prisma.admin.findUnique({
    where: { username },
  });

  if (existingAdmin) {
    console.log(`El usuario admin "${username}" ya existe. Actualizando contraseña...`);
    await prisma.admin.update({
      where: { username },
      data: { password: hashedPassword },
    });
    console.log('Contraseña actualizada correctamente.');
  } else {
    await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    console.log(`Usuario admin creado correctamente.`);
  }

  console.log(`\nUsuario: ${username}`);
  console.log(`Contraseña: ${password}`);
  console.log('\n⚠️  IMPORTANTE: Cambia la contraseña por defecto después del primer login.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });