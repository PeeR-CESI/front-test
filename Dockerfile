# Étape de construction
FROM node:21 AS build-stage

WORKDIR /app

# Copier les fichiers de dépendance et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier les fichiers du projet et construire l'application
COPY . .
RUN npm run build

# Étape de serveur, basée sur Nginx pour servir les fichiers statiques
FROM nginx:stable

# Copier les artefacts de build du stage précédent vers le dossier de serveur de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exposer le port 80 pour accéder à l'application
EXPOSE 80

# Lancer Nginx en mode daemon off
CMD ["nginx", "-g", "daemon off;"]
