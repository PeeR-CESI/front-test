<template>
  <div>
    <h2>Services Vendus</h2>
    <div v-if="loading">Chargement des services...</div>
    <div v-else-if="errorMessage">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else-if="soldServices.length">
      <ul>
        <li v-for="soldService in soldServices" :key="soldService._id">
          <p><strong>Nom du Service:</strong> {{ soldService.nom }}</p>
          <p><strong>Description:</strong> {{ soldService.description }}</p>
          <p><strong>Prix:</strong> {{ soldService.price }}</p>
          <p><strong>Avancement:</strong> {{ soldService.advancement }}%</p>
          <p><strong>ID du Service Vendu:</strong> {{ soldService._id }}</p>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Aucun service vendu trouvé.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import router from "../router";

interface ServiceSold {
  _id: string;
  nom: string;
  description: string;
  price: number;
  advancement: number;
}

function decodeToken(token: string | null): any {
    if (!token) return {};
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }

export default defineComponent({
  name: 'SoldServicesView',
  setup() {
    const soldServices = ref<ServiceSold[]>([]);
    const loading = ref(true);
    const errorMessage = ref('');

    onMounted(async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        errorMessage.value = "Vous n'êtes pas connecté.";
        loading.value = false;
        router.push('/login');
        return;
      }

      const decoded = decodeToken(token);
      if (decoded.role !== 'presta') {
        errorMessage.value = "Accès non autorisé. Cette page est réservée aux prestataires.";
        loading.value = false;
        router.push('/home');
        return;
      }

      const userId = decoded.user_id;
      try {
        const userResponse = await fetch(`http://peer.cesi/api/user/find/${userId}`);
        if (!userResponse.ok) throw new Error('Impossible de récupérer les informations de l’utilisateur.');
        const userData = await userResponse.json();

        const soldServiceIds = userData.sold_service_ids;
        for (const soldServiceId of soldServiceIds) {
          const serviceSellResponse = await fetch(`http://peer.cesi/api/service/sell/${soldServiceId}`);
          if (!serviceSellResponse.ok) throw new Error('Problème lors de la récupération des détails du service vendu.');
          const serviceSellData = await serviceSellResponse.json();

          // Récupérer les détails de base du service utilisant `base_service_id`
          const baseServiceResponse = await fetch(`http://peer.cesi/api/service/${serviceSellData.base_service_id}`);
          if (!baseServiceResponse.ok) throw new Error('Problème lors de la récupération des informations du service de base.');
          const baseServiceData = await baseServiceResponse.json();

          // Construire un objet avec les informations complètes du service
          const fullServiceData = {
            _id: serviceSellData._id,
            advancement: serviceSellData.advancement,
            nom: baseServiceData.nom, // Les champs nom, description et prix sont maintenant correctement assignés
            description: baseServiceData.description,
            price: baseServiceData.price,
          };

          soldServices.value.push(fullServiceData);
        }
      } catch (error) {
        errorMessage.value = 'Erreur lors de la récupération des services vendus: ' + (error instanceof Error ? error.message : String(error));
      } finally {
        loading.value = false;
      }
    });

    return { soldServices, loading, errorMessage };
  },
});
</script>

<style scoped>
/* Styles généraux pour la mise en page */
div {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

/* Styles pour les messages de chargement et d'erreur */
[ v-if="loading" ],
[ v-else-if="errorMessage" ] {
  color: #d9534f;
  font-style: italic;
  text-align: center;
}

/* Styles pour la liste des services */
ul {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

li {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

li:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

p {
  margin: 10px 0;
  line-height: 1.6;
}

/* Met en évidence les éléments clés */
strong {
  color: #2c3e50;
  font-weight: 600;
}

/* Message lorsqu'aucun service n'est trouvé */
div[v-else] {
  text-align: center;
  color: #34495e;
}

@media (min-width: 768px) {
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  li {
    width: calc(50% - 10px);
  }
}

@media (min-width: 1024px) {
  li {
    width: calc(33.333% - 20px);
  }
}
</style>
