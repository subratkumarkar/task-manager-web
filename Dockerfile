# ============ BUILDER =============
FROM node:18-alpine AS builder
WORKDIR /app/client

# Copy only package.json first
COPY client/package*.json ./

# Install ALL dependencies (including dev + vitest)
RUN npm ci

# Copy the rest of the client source
COPY client ./

#RUN TESTS HERE
RUN npm test

# Build frontend
RUN npm run build


# ============ SERVER =============
FROM node:18-alpine
WORKDIR /app

COPY server ./server
RUN cd server && npm ci --production

COPY --from=builder /app/client/dist ./client/dist

EXPOSE 3001
CMD ["node", "server/index.js"]
