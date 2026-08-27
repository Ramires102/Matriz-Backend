# Meeter API — Backend

## Forma para iniciarlo

```bash
cd ~/Proyectos/Meeter/meeter-back/meeter-api

# 1. Sincronizar esquema con la base de datos
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/fiestas_db" npx prisma db push

# 2. Poblar datos de prueba
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/fiestas_db" npx ts-node prisma/seed.ts

# 3. Construir y ejecutar
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/fiestas_db" PORT=3000 npx nest start --watch
```

## Resumen

Backend en NestJS que expone una API REST para la plataforma Meeter.

### Tecnologías principales

- **NestJS** — Framework backend con controladores, servicios y guards.
- **Prisma 7** — ORM conectado a PostgreSQL, con schema dividido en archivos individuales por modelo.
- **JWT + bcrypt** — Autenticación basada en tokens.
- **Express** — Servidor HTTP subyacente.

### Endpoints principales

- **Auth** — `POST /auth/register` y `POST /auth/login`. Registro con nombre, email, DNI (obligatorio) y domicilio (opcional). Devuelve JWT.
- **Eventos** — CRUD completo (`GET /events`, `POST /events`, `GET /events/:id`, `PATCH /events/:id`, `DELETE /events/:id`). Soporta filtros por búsqueda, categoría, ubicación, fecha y paginación con cursor.
- **Categorías** — `GET /events/categories` lista las categorías disponibles para eventos.
- **Invitados** — Agregar/remover/ listar invitados de un evento, con verificación de pertenencia.
- **Rating** — Calificar eventos (crear y eliminar).

### Estructura de archivos

```
prisma/
├── schema.prisma              → datasource + generator
├── schema/*.prisma            → un archivo por modelo (User, Events, etc.)
├── seed.ts                    → datos de prueba
└── migrations/                → migraciones históricas

src/
├── Rutas/                     → controladores (auth, events, users, etc.)
├── Services/                  → lógica de negocio
├── auth/                      → guards JWT y roles
└── common/                    → filtros de excepción
```

### Relaciones

- Depende de **PostgreSQL** corriendo en `localhost:5432`.
- Sirve al **frontend** (`meeter-front`) en el puerto 3001, habilitado con CORS.
- Usa `prisma.config.ts` con Prisma 7, requiriendo adapter `@prisma/adapter-pg`.

### Cómo probar

```bash
# Login con usuario de seed
curl -s http://localhost:3000/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"user":"consumidor","password":"123456"}'

# Listar eventos
curl -s http://localhost:3000/events?limit=5

# Registrar usuario nuevo
curl -s http://localhost:3000/auth/register -X POST \
  -H "Content-Type: application/json" \
  -d '{"user":"test","name":"Test","email":"test@test.com","password":"1234","dni":"12345678","address":"Calle 123"}'
```
