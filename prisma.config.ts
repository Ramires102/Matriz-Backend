import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://admin:adminpassword@localhost:5432/fiestas_db",
  },
})
