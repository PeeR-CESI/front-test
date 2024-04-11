<template>
  <div>
    <h2>Mes Services</h2>
    <div v-if="loading">Chargement de mes services...</div>
    <div v-else-if="errorMessage">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else-if="myServices.length">
      <ul>
        <li v-for="service in myServices" :key="service._id" @click="navigateToService(service._id)" style="cursor: pointer;">
          <p><strong>Nom du Service:</strong> {{ service.nom }}</p>
          <p><strong>Description:</strong> {{ service.description }}</p>
          <p><strong>Prix:</strong> {{ service.price }}€</p>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Aucun service trouvé.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import router from "../router";

// Fonction pour décoder le token JWT et récupérer les informations de l'utilisateur
function decodeToken(token: string): any {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  
  return JSON.parse(jsonPayload);
}

interface Service {
  _id: string;
  nom: string;
  description: string;
  price: number;
  presta_id: string;
}

export default defineComponent({
  name: 'MyServicesView',
  setup() {
    const myServices = ref<Service[]>([]);
    const loading = ref(true);
    const errorMessage = ref('');

    const navigateToService = (serviceId: string) => {
      router.push({ name: 'DisplayService', params: { service_id: serviceId } });
    };

    onMounted(async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        errorMessage.value = "Vous n'êtes pas connecté.";
        loading.value = false;
        router.push('/login');
        return;
      }

      const decoded = decodeToken(token);
      if (!decoded) {
        errorMessage.value = "Impossible de décoder le token utilisateur.";
        loading.value = false;
        return;
      }

      const userRole = decoded.role;
      const userId = decoded.user_id;

      // Les administrateurs obtiennent tous les services
      if (userRole === 'admin') {
        try {
          const response = await fetch('http://peer.cesi/api/service/all');
          if (!response.ok) throw new Error('Erreur lors de la récupération de tous les services');
          myServices.value = await response.json();
        } catch (error) {
          console.error('Erreur:', error);
          errorMessage.value = "Erreur lors de la récupération des services.";
        }
      } else if (userRole === 'presta') {
        // Les prestataires obtiennent uniquement leurs services
        try {
          const userInfoResponse = await fetch(`http://peer.cesi/api/user/find/${userId}`);
          if (!userInfoResponse.ok) throw new Error('Impossible de récupérer les informations de l’utilisateur.');
          const userData = await userInfoResponse.json();

          const serviceIds = userData.service_ids || [];
          for (const serviceId of serviceIds) {
            const serviceResponse = await fetch(`http://peer.cesi/api/service/${serviceId}`);
            if (!serviceResponse.ok) throw new Error('Problème lors de la récupération des détails du service.');
            const serviceData = await serviceResponse.json();
            myServices.value.push(serviceData);
          }
        } catch (error) {
          console.error('Erreur:', error);
          errorMessage.value = "Erreur lors de la récupération des services.";
        }
      } else {
        errorMessage.value = "Accès non autorisé. Cette page est réservée aux prestataires et administrateurs.";
      }

      loading.value = false;
    });

    return { myServices, loading, errorMessage, navigateToService };
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
  
  