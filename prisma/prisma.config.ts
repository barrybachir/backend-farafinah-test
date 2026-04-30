import { defineConfig } from "@prisma/config"

export default defineConfig({
  datasource: {
   
    adapter: "sqlite",
    url: process.env.DATABASE_URL,
  },
})