FROM node:18-alpine AS builder
WORKDIR /app
COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm ci
COPY client ./client
RUN cd client && npm run build
FROM node:18-alpine
WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --production
COPY server ./server
COPY --from=builder /app/client/dist ./client/dist
EXPOSE 3001
CMD ["node", "server/index.js"]
