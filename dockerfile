# Étape 1 : Build TypeScript
FROM node:22-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du code
COPY . .

# Compiler TypeScript en JavaScript
RUN npm run build

# Étape 2 : Conteneur final, plus léger
FROM node:22-alpine

WORKDIR /app

# Copier uniquement le code compilé et les dépendances
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Exposer le port (ajuste si besoin)
EXPOSE 3003

# Démarrer l'application
CMD ["node", "dist/start.js"]