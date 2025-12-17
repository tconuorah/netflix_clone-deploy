# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
# If you use yarn, replace with: COPY yarn.lock ./  and RUN corepack enable && yarn install --frozen-lockfile
RUN npm ci

# Copy app source
COPY . .

# Build a static web export (outputs to ./dist by default for modern Expo)
RUN npx expo export -p web

# ---------- Runtime stage ----------
FROM nginx:alpine
# Copy built static site into Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: basic SPA fallback (uncomment if you use client-side routes)
# RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
