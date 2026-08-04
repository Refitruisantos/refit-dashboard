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

# Build TypeScript
RUN npm run build

# Migrar base de dados e iniciar
CMD npx prisma migrate deploy && npm start

# Expor porta
EXPOSE 4000
