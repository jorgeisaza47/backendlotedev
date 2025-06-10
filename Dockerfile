# Etapa 1: Build
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# 👇 Copia el .env.prod directamente desde tu host
COPY .env.prod .env.prod

ENV NODE_ENV=production

CMD ["node", "dist/main"]

