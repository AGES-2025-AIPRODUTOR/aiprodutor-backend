# ---- Estágio 1: Builder ----
# Este estágio compila a aplicação e instala todas as dependências.
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build


# ---- Estágio 2: Production ----
# Este estágio cria a imagem final, mais leve, apenas com o necessário para rodar.
FROM node:20-alpine

# Instala o cliente do PostgreSQL para ter o comando 'pg_isready'
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copia os artefatos necessários do estágio 'builder'
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copia o script de entrypoint
COPY entrypoint.sh .

# Torna o script executável
RUN chmod +x entrypoint.sh

# Define o script como o ponto de entrada do contêiner
ENTRYPOINT ["./entrypoint.sh"]

# Expõe a porta e define o comando padrão para iniciar a aplicação
EXPOSE 3000
CMD ["node", "dist/src/main.js"]