# 🔐 DOCUMENTACIÓN: Sistema de Autenticación

## 📋 Credenciales de Acceso

### Usuario Administrador (ADMIN)
```
Email:    admin@trendfashion.com
Password: Admin123!@#
Role:     admin
```

### Usuario de Prueba (DEMO)
```
Email:    demo@fashionanalytics.com
Password: Test123!@#
Role:     user
```

---

## 🚀 Acceso a la Plataforma

### 1. Iniciar Sesión
- Dirígete a: `http://localhost:3000/auth/signin`
- Ingresa el email y contraseña
- Se guardará automáticamente la sesión

### 2. Registrar Nueva Cuenta
- Dirígete a: `http://localhost:3000/auth/signup`
- Completa el formulario con:
  - Nombre completo
  - Email (único)
  - Nombre de la consultora
  - Contraseña (mínimo 8 caracteres)
- Se redirigirá automáticamente a login

### 3. Acceder al Panel Admin
- Solo usuarios con `role: "admin"` pueden acceder a `/admin`
- Una vez autenticado, verás el botón "Admin" en la navbar
- Haz clic para ir al panel de administración

---

## 🔑 Cambiar Contraseña del Admin

Si necesitas cambiar la contraseña, accede a Supabase:

1. Ve a https://supabase.com → Tu proyecto
2. Tabla: `users`
3. Busca el email: `admin@trendfashion.com`
4. Actualiza el campo `password` con un hash bcrypt nuevo

Para generar un nuevo hash en Node.js:
```javascript
const bcrypt = require('bcryptjs');
const password = 'NuevaContraseña123!';
const hash = await bcrypt.hash(password, 10);
console.log(hash);
```

---

## 🛠️ Configuración Técnica

### Variables de Entorno (.env.local)
```
# Database
DATABASE_URL=postgresql://postgres:isacanalestfg@db.csgfqslnemnwgiiajncr.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tfg-trendfashion-secret-change-in-production
```

### Estructura de BBDD (Tabla: users)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único (cuid) |
| email | VARCHAR | Email único |
| name | VARCHAR | Nombre del usuario |
| password | VARCHAR | Hash bcrypt de contraseña |
| role | VARCHAR | 'admin' o 'user' (default: 'user') |
| consultancy | VARCHAR | Nombre de la consultora |
| subscription | VARCHAR | free, pro, enterprise (default: 'free') |
| createdAt | TIMESTAMP | Fecha de creación |
| updatedAt | TIMESTAMP | Fecha última actualización |

---

## 🔒 Flujo de Autenticación

1. **Login (POST /api/auth/signin)**
   - Usuario ingresa email + contraseña
   - Se verifica contra hash bcrypt en BBDD
   - Se crea sesión con NextAuth v4
   - Se guarda token en cookie segura

2. **Register (POST /api/auth/register)**
   - Usuario completa formulario de registro
   - Email se valida como único
   - Contraseña se hashea con bcrypt (salt rounds: 10)
   - Usuario se crea con `role: 'user'`
   - Se redirige a login

3. **Session Check**
   - Cada página cliente verifica sesión
   - Si no hay sesión, redirige a `/auth/signin`
   - Si usuario no es admin, redirige de `/admin`

---

## ⚠️ Requisitos de Contraseña

- **Mínimo 8 caracteres**
- Se recomienda incluir:
  - Mayúsculas
  - Minúsculas
  - Números
  - Caracteres especiales (!@#$%^&*)

Ejemplo: `Admin123!@#` ✅

---

## 🍞 Sistema de Notificaciones (Toast)

Los toasts aparecen en la esquina inferior derecha:

- **Success (Verde)**: Operación completada
  ```typescript
  toast.success("¡Sesión iniciada correctamente!")
  ```

- **Error (Rojo)**: Algo salió mal
  ```typescript
  toast.error("Email o contraseña incorrectos")
  ```

- **Info (Azul)**: Información
  ```typescript
  toast.info("Completando registro...")
  ```

- **Warning (Naranja)**: Advertencia
  ```typescript
  toast.warning("Esta acción no se puede deshacer")
  ```

---

## 🐛 Troubleshooting

### "Email o contraseña incorrectos"
- Verifica que el email sea exacto (case-sensitive)
- Contraseña debe ser exacta
- Comprueba en Supabase que el usuario existe

### "Este email ya está registrado"
- El email ya existe en la BBDD
- Usa otro email o recupera contraseña

### Session no se guarda
- Verifica `NEXTAUTH_SECRET` en .env.local
- Comprueba cookies habilitadas en navegador
- Limpia cache del navegador

### Admin no puede acceder a /admin
- Verifica `role` en tabla users sea "admin"
- Cierra sesión y abre de nuevo
- Comprueba logs en terminal

---

## 📊 Roles y Permisos

### User (default)
- ✅ Ver dashboard
- ✅ Ver marcas
- ✅ Ver tendencias
- ✅ Crear reportes
- ✅ Crear reviews
- ❌ Acceder a /admin
- ❌ Editar datos

### Admin
- ✅ Todo lo de User
- ✅ Acceder a /admin
- ✅ Ver todos los usuarios
- ✅ Editar marcas
- ✅ Ingest de métricas
- ✅ Ver estadísticas de plataforma

---

## 🔄 Próximas Mejoras (Roadmap)

- [ ] Recuperación de contraseña por email
- [ ] Autenticación de dos factores (2FA)
- [ ] Roles adicionales (analyst, editor)
- [ ] Auditoría de acciones
- [ ] Rate limiting en login
- [ ] Bloqueo tras N intentos fallidos

---

## 📞 Soporte

Para problemas de autenticación:
1. Revisa los logs en `terminal` (búsca "Error en")
2. Consulta la tabla `users` en Supabase
3. Verifica variables de entorno en `.env.local`

---

**Última actualización:** 17 de mayo de 2026
