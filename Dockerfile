# syntax=docker/dockerfile:1

# Pin specific Node.js version for reproducibility
ARG NODE_VERSION=24.1.0
FROM node:${NODE_VERSION}-alpine AS base

# Install security updates and dependencies
RUN apk update && apk upgrade --no-cache && apk add --no-cache libc6-compat

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./

# Install dependencies with cache mount for faster builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Development dependencies for build
FROM base AS builder-deps
WORKDIR /app

COPY package.json package-lock.json* ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts && \
    npm cache clean --force

# Builder stage
FROM base AS builder
WORKDIR /app

COPY --from=builder-deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Production runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Create .next directory with proper permissions
RUN mkdir .next && chown nextjs:nodejs .next

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8000

ENV PORT=8000
ENV HOSTNAME="0.0.0.0"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

CMD ["node", "server.js"]
