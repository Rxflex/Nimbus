# Dockerfile для сборки и запуска Next.js (multi-stage, production)
# Использует npm; если вы используете yarn/pnpm — замените соответствующие команды.

#### Builder stage ####
FROM node:20-alpine AS builder

# Опции окружения
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Копируем только файлы зависимостей для кэширования npm install
COPY package.json package-lock.json* ./

RUN npm ci

# Копируем остальной код и собираем
COPY . .
RUN npm run build

#### Runner stage ####
FROM node:20-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

WORKDIR /app

# Создадим небезопасного пользователя для запуска приложения не от root
RUN addgroup -S nextjs && adduser -S -G nextjs nextjs

# Копируем собранные артефакты и production-зависимости из builder'а
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Если у вас есть .next/static или другие директории — они уже в .next

# Права и пользователь
RUN chown -R nextjs:nextjs /app
USER nextjs

EXPOSE 3000

# Команда запуска Next.js в production
CMD ["npm", "run", "start"]
