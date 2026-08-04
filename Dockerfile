# Render Dockerfile para REFIT API
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar package.json do backend
COPY backend/package*.json ./

# Instalar dependências
RUN npm install

# Copiar código do backend
COPY backend/ ./

# Gerar Prisma Client
RUN npx prisma generate

# Migrar base de dados e iniciar (usar tsx diretamente, sem build)
CMD npx prisma migrate deploy && npx tsx src/server.ts

# Expor porta
EXPOSE 4000
