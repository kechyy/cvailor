# ================================
# Base stage
# ================================
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# ================================
# Development stage
# ================================
FROM base AS development
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ================================
# Builder stage
# ================================
FROM base AS builder
COPY . .
RUN npm run build

# ================================
# Production stage
# ================================
FROM node:20-alpine AS production
WORKDIR /app

# Only copy what is needed
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Create non-root user
RUN addgroup --system app && \
    adduser --system --group app && \
    chown -R app:app /app

USER app

EXPOSE 3000
CMD ["npm", "start"]