<template>
  <div>
    <h2>{{ pageTitle }}</h2>
    <div v-if="loading">Chargement des services...</div>
    <div v-else-if="errorMessage">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else-if="soldServices.length">
      <ul>
        <li v-for="soldService in soldServices" :key="soldService._id" @click="navigateToServiceDetails(soldService._id)" style="cursor: pointer;">
          <p><strong>Nom du Service:</strong> {{ soldService.name }}</p>
          <p><strong>Description:</strong> {{ soldService.description }}</p>
          <p><strong>Prix:</strong> {{ soldService.price }}</p>
          <p><strong>Avancement:</strong> {{ soldService.advancement }}%</p>
          <p><strong>Statut:</strong> {{ soldService.status }}</p>
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
import { defineComponent, onMounted, ref, computed } from 'vue';
import router from "../router";

interface ServiceSold {
  _id: string;
  name: string;
  description: string;
  price: number;
  advancement: number;
  status: string;
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
    const token = localStorage.getItem('access_token');
    const decodedTokenData = token ? decodeToken(token) : {};
    const userRole = ref(decodedTokenData.role || '');

    const pageTitle = computed(() => {
      return userRole.value === 'admin' ? 'Toutes les prestations' : 'Mes prestations';
    });

    const navigateToServiceDetails = (soldServiceId: string) => {
      router.push({ name: 'DisplayPrestations', params: { sold_service_id: soldServiceId } });
    };

    onMounted(async () => {
      if (!token) {
        errorMessage.value = "Vous n'êtes pas connecté.";
        loading.value = false;
        return;
      }

      const decoded = decodeToken(token);
      const userRole = decoded.role;

      try {
        if (userRole === 'admin') {
          // Si l'utilisateur est un admin, récupérer toutes les prestations vendues
          const response = await fetch(`http://peer.cesi/api/service/sell/all`);
          if (!response.ok) throw new Error('Erreur lors de la récupération des services vendus.');
          soldServices.value = await response.json();
        } else if (userRole === 'presta') {
          // Si l'utilisateur est un prestataire, effectuer une logique supplémentaire pour récupérer ses prestations vendues
          const userId = decoded.user_id;
          const userResponse = await fetch(`http://peer.cesi/api/user/find/${userId}`);
          if (!userResponse.ok) throw new Error('Impossible de récupérer les informations de l’utilisateur.');
          const userData = await userResponse.json();

          const soldServiceIds = userData.sold_service_ids || [];
          const fetchPromises = soldServiceIds.map((soldServiceId: string) => fetch(`http://peer.cesi/api/service/sell/${soldServiceId}`));
          const responses = await Promise.all(fetchPromises);

          // Filtrer les réponses non réussies avant de tenter de lire le JSON
          const successfulResponses = responses.filter(response => response.ok);
          if (successfulResponses.length !== responses.length) {
            throw new Error('Problème lors de la récupération des détails des services vendus.');
          }

          const dataPromises = successfulResponses.map(response => response.json());
          const servicesData = await Promise.all(dataPromises);
          soldServices.value = servicesData;
        } else {
          errorMessage.value = "Accès non autorisé.";
          loading.value = false;
          return;
        }
      } catch (error) {
        errorMessage.value = 'Erreur lors de la récupération des services vendus: ' + (error instanceof Error ? error.message : String(error));
      } finally {
        loading.value = false;
      }
    });

    return { soldServices, loading, errorMessage, navigateToServiceDetails, pageTitle };
  },
});
</script>

<style scoped>
  div {
    max-width: 960px;
    margin: 40px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  h2 {
    color: #2A9D8F;
    text-align: center;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    background-color: #F4F4F4;
    border-left: 5px solid #2A9D8F;
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }
  
  li:hover {
    background-color: #E9E9E9;
  }
  
  p {
    margin: 10px 0;
    color: #333;
    line-height: 1.5;
  }
  
  strong {
    color: #264653;
    font-weight: 600;
  }
  
  [ v-if="loading" ],
  [ v-else-if="errorMessage" ] {
    text-align: center;
    color: #E76F51;
    font-size: 18px;
    font-style: italic;
  }
  
  div[v-else] {
    text-align: center;
    color: #264653;
    font-size: 18px;
  }
  
  @media (min-width: 768px) {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  
    p {
      margin: 5px 10px;
    }
  }
  </style>
