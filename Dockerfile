# ---- Estágio 1: Builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Remove arquivos desnecessários e duplicados
RUN rm -f dist/lambda.js dist/lambda.js.map dist/lambda.d.ts
RUN rm -f dist/main.js dist/main.js.map dist/main.d.ts

RUN npm prune --production

# ---- Estágio 2: Production ----
FROM public.ecr.aws/lambda/nodejs:20
WORKDIR ${LAMBDA_TASK_ROOT}

# Copia APENAS o conteúdo essencial de dist/src/
COPY --from=builder /app/dist/src/ ./

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

CMD [ "lambda.handler" ]