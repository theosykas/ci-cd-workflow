# Image de base Node.js légère
FROM node:18-alpine

# Dossier de travail dans le conteneur
WORKDIR /usr/src/app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation propre des dépendances pour la production
RUN npm ci --only=production

# Copie du reste du code source du backend
COPY . .

# Exposition du port sur lequel ton API écoute (généralement 3000 ou 5000)
EXPOSE 3000

# Commande pour démarrer ton serveur backend
CMD ["npm", "start"]
