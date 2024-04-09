# Étape de construction
# Utilisez une version spécifique de node pour éviter tout problème de compatibilité
FROM node:16 as build-stage

# Définir le répertoire de travail dans l'image
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier les fichiers et dossiers du projet dans l'image
COPY my-vue-app/ .

# Construire l'application pour la production
RUN npm run build

# Étape de mise en service
FROM nginx:stable-alpine as production-stage

# Copier les artefacts de build dans le dossier de serve de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exposer le port 80 pour accéder à l'application
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
