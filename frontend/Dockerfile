# --- dev stage: vite dev server ---
  FROM node:20 AS development 

  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  EXPOSE 3000
  CMD ["npm", "run", "dev", "--", "--host", "--port", "3000"]
  
  # --- build stage ---
  FROM node:20 AS builder
  WORKDIR /app
  COPY --from=development /app /app
  RUN npm run build
  
  # --- prod stage: serve dist ---
  FROM node:20 AS production
  WORKDIR /app
  RUN npm install -g serve
  COPY --from=builder /app/dist ./dist
  EXPOSE 3000

  CMD ["serve", "-s", "dist", "-l", "3000", "--host", "0.0.0.0"]
