
FROM node:18-alpine AS builder
WORKDIR /app
COPY client/package.json client/package-lock.json ./client/
WORKDIR /app/client
RUN npm ci
COPY client/ ./
RUN npm run build
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/client/dist ./client/dist
COPY server/ ./server
COPY package.json package-lock.json* ./
RUN npm ci --production || npm ci --omit=dev
EXPOSE 3001
CMD ["node", "server/index.js"]