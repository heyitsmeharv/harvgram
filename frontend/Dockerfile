# --- dev stage ---
FROM node:20 AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# --- build stage ---
FROM node:20 AS builder
WORKDIR /app
COPY --from=development /app /app
RUN npm run build

# --- production stage ---
FROM node:20-alpine AS production
WORKDIR /app
RUN npm install -g serve

# Copy static assets
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "ls -la ./dist && sleep 300"]