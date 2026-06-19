# Étape 1 : Build de l'application Node.js
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# On génère les fichiers statiques (remplace par build si ton framework utilise npm run build)
RUN npm run build

# Étape 2 : Serveur web léger pour distribuer le front
FROM nginx:alpine

# Copie les fichiers buildés dans le dossier public d'Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Ou si tu utilises Vite/Next, adapte le chemin (ex: /app/dist)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
