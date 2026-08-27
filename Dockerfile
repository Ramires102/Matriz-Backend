# --- ETAPA 1: Construcción (Build) ---
FROM node:20-alpine AS builder

# Instalamos dependencias de sistema para compilar Sharp y Bcrypt
RUN apk add --no-cache python3 make g++ gcc libc6-compat

WORKDIR /app

# Copiamos archivos de dependencias y schema de Prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instalamos todas las dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Generamos el cliente de Prisma
RUN npx prisma generate

# Compilamos el proyecto (TS -> JS)
RUN npm run build

# --- ETAPA 2: Producción (Runtime) ---
FROM node:20-alpine

# Dependencias de sistema necesarias para Sharp y runtime en Alpine
RUN apk add --no-cache vips-dev libc6-compat

WORKDIR /app

# Copiamos solo lo necesario de la etapa anterior para que la imagen pese poco
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Exponemos el puerto de NestJS
EXPOSE 3000

# Entorno de producción
ENV NODE_ENV=production

# Comando: Genera cliente de Prisma y luego inicia la App
CMD ["sh", "-c", "npx prisma generate && npm run start:prod"]
