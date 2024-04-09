# Étape de construction
FROM node:21

# Définir le répertoire de travail dans l'image
WORKDIR /app

# Assurez-vous de copier les fichiers package.json et package-lock.json depuis le bon dossier
COPY my-vue-app/package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier les fichiers et dossiers du projet dans l'image depuis le bon dossier
COPY my-vue-app/ ./

# Modifier les scripts de build pour utiliser npx
# Assurez-vous que votre package.json utilise "npx vue-tsc && npx vite build" pour le script "build".

# Construire l'application pour la production
RUN npm run build

# Étape de mise en service
FROM nginx:stable-alpine

# Copier les artefacts de build dans le dossier de serve de Nginx depuis le bon emplacement
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exposer le port 80 pour accéder à l'application
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]