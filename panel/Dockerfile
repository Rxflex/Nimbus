# Dockerfile для сборки и запуска Next.js (multi-stage, production) на bun

#### Builder stage ####
FROM oven/bun:1 AS builder

# Опции окружения
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Копируем только файлы зависимостей для кэширования bun install
COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

# Копируем остальной код и собираем
COPY . .
RUN bun run build

#### Runner stage ####
FROM oven/bun:1 AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

WORKDIR /app

# Создадим небезопасного пользователя для запуска приложения не от root
RUN addgroup --system nextjs && adduser --system --ingroup nextjs nextjs

# Копируем собранные артефакты и production-зависимости из builder'а
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Права и пользователь
RUN chown -R nextjs:nextjs /app
USER nextjs

EXPOSE 3000

# Команда запуска Next.js в production
CMD ["bun", "run", "start"]
