
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist/client ./dist/client
COPY src/server ./src/server
COPY package.json package-lock.json* ./
RUN npm ci --production
EXPOSE 3001
CMD ["node", "src/server/index.js"]
