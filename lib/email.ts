import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOnboardingEmail(email: string, name: string) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY no está configurada. El email no se enviará.');
    return { success: false, error: 'RESEND_API_KEY no configurada' };
  }

  console.log('Intentando enviar email de onboarding a:', email);

  const subject = 'Playbook 50K: aquí tienes todo lo que necesitas';
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Hola${name ? ' ' + name : ''},</p>
  
  <p>Ya has descargado el Playbook 50K.<br>
  Antes de abrirlo y empezar a rellenar ejercicios, hay algo muy importante que necesito decirte.</p>
  
  <h2 style="color: #2c3e50; margin-top: 30px;">1️⃣ Antes del Playbook: mira los 5 vídeos</h2>
  <p>Este Playbook no va solo.</p>
  <p>Es la continuación natural de la serie de 5 vídeos donde se explica el contexto, el porqué y la lógica de cada bloque.<br>
  Si empiezas el Playbook sin haber visto esos vídeos (o viéndolos "de fondo"), te van a faltar piezas clave.</p>
  
  <p><strong>Mi recomendación es muy clara:</strong><br>
  👉 primero, mira los 5 vídeos<br>
  👉 toma notas<br>
  👉 y después vuelve al Playbook</p>
  
  <p>Puedes acceder a todo desde aquí:<br>
  👉 <a href="https://playbook50k.fisioreferentes.com" style="color: #3498db;">https://playbook50k.fisioreferentes.com</a></p>
  
  <p>Te prometo que la experiencia cambia por completo cuando haces este orden.</p>
  
  <h2 style="color: #2c3e50; margin-top: 30px;">2️⃣ El objetivo del Playbook 50K (muy al grano)</h2>
  <p>Este Playbook no es para motivarte ni para inspirarte un rato.</p>
  <p>Su objetivo es ayudarte a pensar tu clínica con criterio, tomar decisiones conscientes y construir un negocio de fisioterapia:</p>
  <ul>
    <li>rentable</li>
    <li>sostenible</li>
    <li>y alineado con una buena vida (no con una agenda llena sin control)</li>
  </ul>
  
  <p>No es un documento para leer.<br>
  Es un documento para pensar, decidir y construir.</p>
  
  <h2 style="color: #2c3e50; margin-top: 30px;">3️⃣ Cómo te recomiendo trabajarlo</h2>
  <p>Dos opciones, elige la que mejor encaje contigo:</p>
  <ul>
    <li>Imprimirlo y rellenarlo a mano.</li>
    <li>O trabajar cada ejercicio en un Word / Google Docs, respondiendo con tus propias palabras.</li>
  </ul>
  
  <p>Busca una hora tranquila.<br>
  Sin prisas.<br>
  Sin pacientes entre medias.</p>
  
  <p><strong>Aquí no gana el que responde "bonito", gana el que responde honesto.</strong></p>
  
  <h2 style="color: #2c3e50; margin-top: 30px;">4️⃣ Apoyo extra: grupo privado de WhatsApp</h2>
  <p>Para acompañarte en el proceso, hemos creado un grupo privado de WhatsApp solo para personas que han descargado el Playbook 50K.</p>
  
  <p>En este grupo:</p>
  <ul>
    <li>resolvemos dudas reales sobre los ejercicios</li>
    <li>aportamos claridad y criterio</li>
    <li>compartimos aprendizajes útiles</li>
    <li>y preparamos masterclasses GRATUITAS, con el único objetivo de aportar valor y ayudaros a avanzar con sentido</li>
  </ul>
  
  <p>No es un grupo de spam.<br>
  No es un grupo para vender.<br>
  Es un espacio tranquilo para no ir a ciegas.</p>
  
  <p>👉 <a href="https://chat.whatsapp.com/I9IHMDjHwd2Le0tIqJvweb" style="color: #3498db;">Únete aquí al grupo privado de WhatsApp</a></p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  
  <p><strong>Mi recomendación final:</strong><br>
  👉 empieza por los vídeos<br>
  👉 trabaja el Playbook con calma<br>
  👉 y apóyate en el grupo si te surgen dudas</p>
  
  <p>Aquí no se trata de correr.<br>
  Se trata de hacer las cosas bien desde el principio.</p>
  
  <p>Un abrazo,<br>
  <strong>Jano</strong><br>
  FISIOREF</p>
</body>
</html>
  `;
  
  const plainTextBody = `
Hola${name ? ' ' + name : ''},

Ya has descargado el Playbook 50K.
Antes de abrirlo y empezar a rellenar ejercicios, hay algo muy importante que necesito decirte.

1️⃣ Antes del Playbook: mira los 5 vídeos
Este Playbook no va solo.

Es la continuación natural de la serie de 5 vídeos donde se explica el contexto, el porqué y la lógica de cada bloque.
Si empiezas el Playbook sin haber visto esos vídeos (o viéndolos "de fondo"), te van a faltar piezas clave.

Mi recomendación es muy clara:
👉 primero, mira los 5 vídeos
👉 toma notas
👉 y después vuelve al Playbook

Puedes acceder a todo desde aquí:
👉 https://playbook50k.fisioreferentes.com

Te prometo que la experiencia cambia por completo cuando haces este orden.

2️⃣ El objetivo del Playbook 50K (muy al grano)
Este Playbook no es para motivarte ni para inspirarte un rato.

Su objetivo es ayudarte a pensar tu clínica con criterio, tomar decisiones conscientes y construir un negocio de fisioterapia:
- rentable
- sostenible
- y alineado con una buena vida (no con una agenda llena sin control)

No es un documento para leer.
Es un documento para pensar, decidir y construir.

3️⃣ Cómo te recomiendo trabajarlo
Dos opciones, elige la que mejor encaje contigo:
- Imprimirlo y rellenarlo a mano.
- O trabajar cada ejercicio en un Word / Google Docs, respondiendo con tus propias palabras.

Busca una hora tranquila.
Sin prisas.
Sin pacientes entre medias.

Aquí no gana el que responde "bonito", gana el que responde honesto.

4️⃣ Apoyo extra: grupo privado de WhatsApp
Para acompañarte en el proceso, hemos creado un grupo privado de WhatsApp solo para personas que han descargado el Playbook 50K.

En este grupo:
- resolvemos dudas reales sobre los ejercicios
- aportamos claridad y criterio
- compartimos aprendizajes útiles
- y preparamos masterclasses GRATUITAS, con el único objetivo de aportar valor y ayudaros a avanzar con sentido

No es un grupo de spam.
No es un grupo para vender.
Es un espacio tranquilo para no ir a ciegas.

👉 Únete aquí al grupo privado de WhatsApp:
https://chat.whatsapp.com/I9IHMDjHwd2Le0tIqJvweb

---

Mi recomendación final:
👉 empieza por los vídeos
👉 trabaja el Playbook con calma
👉 y apóyate en el grupo si te surgen dudas

Aquí no se trata de correr.
Se trata de hacer las cosas bien desde el principio.

Un abrazo,
Jano
FISIOREF
  `;
  
  try {
    // Sin dominio personalizado, usar el dominio de prueba de Resend
    // IMPORTANTE: Para usar tu propio dominio, debes configurarlo en Resend
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    console.log('Enviando email desde:', fromEmail);
    console.log('Enviando email a:', email);
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: subject,
      html: htmlBody,
      text: plainTextBody,
    });

    if (error) {
      console.error('❌ Error al enviar email de onboarding:', JSON.stringify(error, null, 2));
      return { success: false, error: error.message };
    }

    console.log('✅ Email de onboarding enviado exitosamente a:', email);
    console.log('ID del email:', data?.id);
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Error al enviar email de onboarding:', error);
    console.error('Detalles del error:', error?.message || 'Error desconocido');
    return { success: false, error: error?.message || 'Error desconocido' };
  }
}
