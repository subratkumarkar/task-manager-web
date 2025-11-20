FROM node:18-alpine AS builder
WORKDIR /app

COPY client ./client
COPY server ./server
COPY package.json package-lock.json ./

WORKDIR /app/client
RUN npm install
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY server ./server
COPY --from=builder /app/client/dist ./client/dist
COPY package.json package-lock.json ./
RUN npm install --production

EXPOSE 3001
CMD ["node", "server/index.js"]
