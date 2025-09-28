# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY bun.lockb package.json tsconfig*.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY src/ ./src/

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1 AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y dumb-init && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN addgroup --system nodejs && adduser --system --ingroup nodejs nestjs

# Copy package files
COPY bun.lock package.json ./

# Install only production dependencies
RUN bun install --production --frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership to non-root user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run dist/health-check.js || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["bun", "dist/main.js"]
