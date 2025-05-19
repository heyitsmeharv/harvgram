# --- Stage 1: Build with Vite ---
  FROM node:20 AS development
  WORKDIR /app
  
  # Install dependencies and build the Vite app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build
  
  # --- Stage 2: Serve with Nginx ---
  FROM nginx:alpine
  WORKDIR /usr/share/nginx/html
  
  # Copy the built frontend
  COPY --from=development /app/dist .

  RUN echo "--- FILES IN /usr/share/nginx/html ---" && ls -l /usr/share/nginx/html
  
  # Copy custom Nginx config
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  
  # Expose the port ECS will route to (must match task def & ALB target group)
  EXPOSE 3000
  
  # Start Nginx
  CMD ["nginx", "-g", "daemon off;"]
  