# ============ BUILDER =============
FROM node:18-alpine AS builder
WORKDIR /app

COPY client ./client
RUN cd client && npm ci
RUN cd client && npm run build

# ============ SERVER =============
FROM node:18-alpine
WORKDIR /app

COPY server ./server
RUN cd server && npm ci --production

COPY --from=builder /app/client/dist ./client/dist

EXPOSE 3001
CMD ["node", "server/index.js"]
