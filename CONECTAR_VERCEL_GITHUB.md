# Conectar Vercel con Repositorio Privado de GitHub

Si tu repositorio de GitHub es privado, Vercel necesita permisos para acceder a él. Aquí te explico cómo configurarlo.

## 🔐 Opción 1: Conectar desde Vercel (Recomendado)

### Paso 1: Verificar la Conexión de GitHub

1. **Ve a Vercel Dashboard**
   - Accede a [vercel.com](https://vercel.com)
   - Inicia sesión

2. **Ve a Settings → Git**
   - En el menú lateral, ve a **Settings**
   - Selecciona **Git** o **Connected Git Repositories**

3. **Verifica la Conexión**
   - Deberías ver tu cuenta de GitHub conectada
   - Si no está conectada, haz clic en **Connect GitHub**

4. **Autorizar Vercel**
   - GitHub te pedirá autorizar a Vercel
   - Asegúrate de dar permisos para:
     - ✅ Acceder a repositorios privados
     - ✅ Leer y escribir acceso (si es necesario)

### Paso 2: Reimportar el Proyecto

1. **Ve a tu proyecto en Vercel**
   - Si ya tienes un proyecto, ve a **Settings → Git**
   - Si no tienes proyecto, ve a **Add New Project**

2. **Reconectar el Repositorio**
   - Haz clic en **Disconnect** (si ya está conectado)
   - Luego **Connect Git Repository**
   - Busca `playbook-50k` en la lista
   - Selecciona el repositorio

3. **Configurar el Proyecto**
   - Framework Preset: **Next.js** (debería detectarse automáticamente)
   - Root Directory: `./` (dejar por defecto)
   - Build Command: `npm run build` (debería estar por defecto)
   - Output Directory: `.next` (debería estar por defecto)

4. **Configurar Variables de Entorno**
   - Antes de hacer Deploy, ve a **Environment Variables**
   - Añade todas las variables necesarias (ver `CONFIGURAR_VERCEL.md`)

5. **Deploy**
   - Haz clic en **Deploy**
   - Vercel debería detectar los cambios y desplegar

## 🔄 Opción 2: Forzar Deploy Manual

Si ya tienes el proyecto conectado pero no detecta cambios:

1. **Ve a Deployments**
   - En tu proyecto de Vercel, ve a la pestaña **Deployments**

2. **Redeploy**
   - Haz clic en los tres puntos (⋯) del último deployment
   - Selecciona **Redeploy**
   - Esto forzará un nuevo deploy con el código actual

## 🔧 Opción 3: Usar Vercel CLI

Si prefieres usar la línea de comandos:

```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Login en Vercel
vercel login

# Conectar el proyecto
cd /Users/jano/Documents/playbook-50k
vercel link

# Esto te pedirá:
# - Seleccionar o crear un proyecto
# - Confirmar la configuración

# Desplegar
vercel --prod
```

## 🔍 Verificar que Funciona

### Verificar Webhooks de GitHub

1. **En GitHub:**
   - Ve a tu repositorio: `https://github.com/janocabello90/playbook-50k`
   - Ve a **Settings → Webhooks**
   - Deberías ver un webhook de Vercel
   - Si no está, Vercel lo creará automáticamente al conectar

2. **En Vercel:**
   - Ve a **Settings → Git**
   - Deberías ver el repositorio conectado
   - Verifica que el branch sea `main`

### Probar el Deploy Automático

1. **Haz un cambio pequeño**
   ```bash
   echo "# Test" >> README.md
   git add README.md
   git commit -m "test: verificar deploy automático"
   git push origin main
   ```

2. **Verifica en Vercel**
   - Ve a **Deployments** en Vercel
   - Deberías ver un nuevo deployment iniciándose automáticamente
   - Si no aparece, hay un problema con la conexión

## 🐛 Solución de Problemas

### Vercel no detecta cambios

**Problema:** Haces push pero Vercel no inicia un deploy

**Soluciones:**
1. Verifica que el webhook de GitHub esté activo
2. Revisa los logs en GitHub: Settings → Webhooks → Ver deliveries
3. Desconecta y vuelve a conectar el repositorio en Vercel
4. Usa deploy manual: Redeploy desde Vercel

### Error: "Repository not found"

**Problema:** Vercel no puede acceder al repositorio privado

**Soluciones:**
1. Ve a GitHub → Settings → Applications → Authorized OAuth Apps
2. Busca "Vercel" y verifica los permisos
3. Si no está, reconecta GitHub desde Vercel
4. Asegúrate de dar permisos para repositorios privados

### Error: "Build failed"

**Problema:** El deploy falla en el build

**Soluciones:**
1. Verifica que todas las variables de entorno estén configuradas
2. Revisa los logs del build en Vercel
3. Verifica que `package.json` tenga el script `build`
4. Asegúrate de que no haya errores de TypeScript

## 📝 Notas Importantes

- ✅ Vercel puede acceder a repositorios privados si le das permisos
- ✅ Los webhooks se crean automáticamente al conectar
- ✅ Cada push a `main` debería iniciar un deploy automático
- ✅ Puedes desplegar manualmente desde Vercel si es necesario
- ⚠️ Si cambias el nombre del repositorio, necesitas reconectar

## 🔗 Enlaces Útiles

- [Documentación de Vercel sobre Git](https://vercel.com/docs/concepts/git)
- [Troubleshooting Vercel Deployments](https://vercel.com/docs/concepts/deployments/troubleshooting)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
