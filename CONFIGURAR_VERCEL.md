# Configurar Variables de Entorno en Vercel

Este documento explica cómo configurar las variables de entorno necesarias para desplegar el proyecto en Vercel.

## 📋 Variables Requeridas

El proyecto necesita las siguientes variables de entorno:

### Supabase (Base de datos)
- `NEXT_PUBLIC_SUPABASE_URL` - URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clave anónima de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - (Opcional) Clave de servicio para scripts

### Resend (Emails)
- `RESEND_API_KEY` - API Key de Resend
- `RESEND_FROM_EMAIL` - (Opcional) Email desde el que enviar

## 🚀 Pasos para Configurar en Vercel

### Opción 1: Desde el Dashboard de Vercel (Recomendado)

1. **Ve a tu proyecto en Vercel**
   - Accede a [vercel.com](https://vercel.com)
   - Selecciona tu proyecto `playbook-50k`

2. **Abre la configuración de Variables de Entorno**
   - Ve a **Settings** → **Environment Variables**

3. **Añade cada variable una por una:**

   ```
   Nombre: NEXT_PUBLIC_SUPABASE_URL
   Valor: https://tu-proyecto.supabase.co
   Entornos: Production, Preview, Development (marca todos)
   ```

   ```
   Nombre: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (tu clave completa)
   Entornos: Production, Preview, Development
   ```

   ```
   Nombre: RESEND_API_KEY
   Valor: re_tu_api_key_aqui
   Entornos: Production, Preview, Development
   ```

   ```
   Nombre: RESEND_FROM_EMAIL
   Valor: onboarding@tudominio.com
   Entornos: Production, Preview, Development
   ```

   ```
   Nombre: SUPABASE_SERVICE_ROLE_KEY
   Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (tu service role key)
   Entornos: Production, Preview, Development
   ```

4. **Guarda los cambios**
   - Haz clic en **Save** después de cada variable

5. **Redespliega la aplicación**
   - Ve a **Deployments**
   - Haz clic en los tres puntos (⋯) del último deployment
   - Selecciona **Redeploy**
   - O simplemente haz un nuevo push a `main` y se desplegará automáticamente

### Opción 2: Desde la CLI de Vercel

```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Login en Vercel
vercel login

# Añadir variables de entorno
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add RESEND_API_KEY
vercel env add RESEND_FROM_EMAIL
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Para cada variable, pega el valor cuando te lo pida
# Selecciona los entornos: Production, Preview, Development
```

## 🔍 Dónde Obtener los Valores

### Supabase

1. Ve a [app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ mantener secreta)

### Resend

1. Ve a [resend.com](https://resend.com)
2. Inicia sesión
3. Ve a **API Keys**
4. Crea una nueva API Key o copia una existente
5. Copia la clave → `RESEND_API_KEY`

### Email de Resend

- Si usas dominio de prueba: `onboarding@resend.dev` (no necesitas configurarlo)
- Si configuraste tu dominio: `onboarding@tudominio.com` → `RESEND_FROM_EMAIL`

## ✅ Verificar que Funciona

Después de configurar las variables y redesplegar:

1. **Verifica el formulario público**
   - Accede a tu URL de Vercel
   - Rellena el formulario
   - Verifica que se guarda en Supabase

2. **Verifica el envío de emails**
   - Revisa los logs de Vercel
   - Deberías ver: `✅ Email de onboarding enviado exitosamente`
   - Revisa tu bandeja de entrada

3. **Verifica el panel de admin**
   - Accede a `https://tu-dominio.vercel.app/admin`
   - Inicia sesión con tus credenciales
   - Verifica que puedes ver los leads

## 🔒 Seguridad

- ✅ Las variables con `NEXT_PUBLIC_` son accesibles desde el frontend (necesario para Supabase)
- ✅ Las variables sin `NEXT_PUBLIC_` son solo del servidor (más seguras)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` nunca debe exponerse en el frontend
- ✅ `RESEND_API_KEY` nunca debe exponerse en el frontend

## 🐛 Solución de Problemas

### Error: "Missing Supabase environment variables"
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén configuradas
- Asegúrate de haber redesplegado después de añadir las variables

### Error: "RESEND_API_KEY no configurada"
- Verifica que `RESEND_API_KEY` esté configurada en Vercel
- Asegúrate de haber redesplegado después de añadir la variable

### Los emails no se envían
- Verifica que `RESEND_API_KEY` sea correcta
- Revisa los logs de Vercel para ver el error específico
- Si usas dominio personalizado, verifica que esté configurado en Resend

### No puedo iniciar sesión en admin
- Verifica que la tabla `admins` exista en Supabase
- Crea un usuario admin usando el script: `npm run create-admin`

## 📝 Notas Importantes

- Las variables de entorno se aplican **después** de redesplegar
- Si cambias una variable, debes redesplegar para que surta efecto
- Las variables son diferentes para Production, Preview y Development
- Puedes tener valores diferentes para cada entorno si es necesario
