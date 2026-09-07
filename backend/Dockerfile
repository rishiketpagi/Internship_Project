# Multi-stage build for the Resume Generator backend.
# Stage 1: deps + build
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Stage 2: runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=5000

# Run as a non-root user for better security posture.
RUN addgroup -S app && adduser -S app -G app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY public ./public

USER app
EXPOSE 5000

# Healthcheck — pings the cached /health endpoint.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/health || exit 1

CMD ["node", "src/index.js"]
