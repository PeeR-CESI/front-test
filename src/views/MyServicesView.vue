<template>
    <div>
      <h2>Mes Services</h2>
      <div v-if="loading">Chargement de mes services...</div>
      <div v-else-if="errorMessage">
        <p>{{ errorMessage }}</p>
      </div>
      <div v-else-if="myServices.length">
        <ul>
          <!-- Ajoutez @click="navigateToService(service._id)" à chaque élément de la liste -->
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

interface Service {
  _id: string;
  nom: string;
  description: string;
  price: string;
  presta_id: number;
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

      const userId = localStorage.getItem('user_id');
      if (!userId) {
        errorMessage.value = "ID utilisateur non trouvé.";
        loading.value = false;
        return;
      }

      try {
        const response = await fetch(`http://peer.cesi/api/user/find/${userId}`);
        if (!response.ok) throw new Error('Impossible de récupérer les informations de l’utilisateur.');
        const userData = await response.json();

        if (userData.role !== 'presta') {
          errorMessage.value = "Accès non autorisé. Cette page est réservée aux prestataires.";
          loading.value = false;
          return;
        }

        const serviceIds = userData.service_ids;
        for (const serviceId of serviceIds) {
          const serviceResponse = await fetch(`http://peer.cesi/api/service/${serviceId}`);
          if (!serviceResponse.ok) throw new Error('Problème lors de la récupération des détails du service.');
          const serviceData = await serviceResponse.json();
          myServices.value.push(serviceData);
        }
      } catch (error: any) {
        errorMessage.value = 'Erreur lors de la récupération de mes services: ' + (error.message || String(error));
      } finally {
        loading.value = false;
      }
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
  
  