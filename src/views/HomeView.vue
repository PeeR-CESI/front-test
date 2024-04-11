<template>
  <div class="home">
    <h1>Bienvenue, {{ username }}</h1>
    <button v-if="role === 'presta'" class="create-service-button" @click="goToCreateService">Créer un service</button>
    <h2>Retrouvez ici quelques services proposés par la communauté :</h2>
    <div class="services-container">
      <div
          class="service-card"
          v-for="service in services"
          :key="service._id"
          @click="navigateToService(service._id)"
      >
        <div class="service-image">
          <img :src="serviceImage" alt="Service image" />
        </div>
        <h3>{{ service.nom }}</h3>
        <p>{{ service.description }}</p>
        <p class="price">{{ service.price }} €</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import serviceImage from '../assets/bureau.jpg';

interface Service {
  _id: number;
  nom: string;
  description: string;
  price: string;
}

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter();
    const username = computed(() => localStorage.getItem('username'));
    const services = ref<Service[]>([]);
    const role = computed(() => localStorage.getItem('role'));

    const navigateToService = (id: number) => {
      router.push(`/service/display/${id}`);
    };

    const goToCreateService = () => {
      router.push('/service/create');
    };

    const goToUserList = () => {
      router.push('/user-list');
    };

    onMounted(async () => {
      try {
        const response = await fetch('http://peer.cesi/api/service/all');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des services');
        }
        services.value = await response.json();
      } catch (error) {
        console.error(error);
      }
    });

    const logout = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
      router.push('/login');
    };

    const goToSettings = () => {
      router.push('/account/parameters');
    };
    const showSponsorModal = ref(false);
    const sponsorEmail = ref('');

    const sendSponsorEmail = async () => {
      try {
        const response = await fetch('http://peer.cesi/api/sponsor/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: sponsorEmail.value }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'envoi de l\'email');
        }

        showSponsorModal.value = false;
        sponsorEmail.value = '';

        alert('Email envoyé avec succès');
      } catch (error) {
        console.error(error);
        alert('Erreur lors de l\'envoi de l\'email');
      }
    };

    return {
      username,
      services,
      goToSettings,
      showSponsorModal,
      sponsorEmail,
      sendSponsorEmail,
      goToUserList,
      logout,
      role,
      goToCreateService,
      navigateToService,
      serviceImage,
    };
  },
});
</script>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.service-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.service-card:hover {
  transform: scale(1.05);
}

.service-image img {
  width: 100%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.home {
  padding: 2rem;
}

.services-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.service-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  width: calc(20% - 1rem);
}

.price {
  color: green;
  font-weight: bold;
}

.create-service-button {
  background-color: white;
  color: #4CAF50;
  border: 2px solid #4CAF50;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 20px;
  transition: background-color 0.3s, color 0.3s;
}

.create-service-button:hover {
  background-color: #4CAF50;
  color: white;
}
</style>