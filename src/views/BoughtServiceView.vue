<template>
    <div>
      <h2>Services Achetés</h2>
      <div v-if="loading">Chargement des services...</div>
      <div v-else-if="errorMessage">
        <p>{{ errorMessage }}</p>
      </div>
      <div v-else-if="services.length">
        <ul>
          <li v-for="service in services" :key="service._id">
            <p><strong>Nom du Service:</strong> {{ service.nom }}</p>
            <p><strong>Description:</strong> {{ service.description }}</p>
            <p><strong>Prix:</strong> {{ service.price }}</p>
            <p><strong>Nom du Prestataire:</strong> {{ service.presta.nom }}</p>
            <p><strong>Prénom du Prestataire:</strong> {{ service.presta.prenom }}</p>
            <p><strong>Email du Prestataire:</strong> {{ service.presta.email }}</p>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Aucun service acheté trouvé.</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import router from "../router";

  interface Presta {
    nom: string;
    prenom: string;
    email: string;
  }
    
  interface Service {
    _id: string;
    nom: string;
    description: string;
    price: number;
    presta: Presta;
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
    name: 'BoughtServiceView',
    setup() {
      const services = ref<Service[]>([]);
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
        if (decoded.role !== 'demandeur') {
          errorMessage.value = "Accès non autorisé. Cette page est réservée aux demandeurs.";
          loading.value = false;
          router.push('/');
          return;
        }
  
        const userIdFromToken = String(decoded.user_id).trim();
        const userId = String(localStorage.getItem('user_id')).trim();
        
        console.log(`User ID from Token: ${userIdFromToken}, User ID from localStorage: ${userId}`);

        if (userIdFromToken !== userId) {
            console.error("Les ID des utilisateurs ne correspondent pas.");
            errorMessage.value = "Accès non autorisé. Les informations demandées ne vous appartiennent pas.";
            loading.value = false;
            router.push('/login');
            return;
        }
  
        try {
          const userInfoResponse = await fetch(`http://peer.cesi/api/user/find/${userId}`);
          if (!userInfoResponse.ok) {
            throw new Error('Impossible de récupérer les informations de l\'utilisateur.');
          }
          const userInfo = await userInfoResponse.json();
          const soldServiceIds = userInfo.sold_service_ids || [];
  
          for (const soldServiceId of soldServiceIds) {
            const soldServiceResponse = await fetch(`http://peer.cesi/api/service/sell/${soldServiceId}`);
            if (soldServiceResponse.ok) {
              const soldServiceData = await soldServiceResponse.json();
              const baseServiceResponse = await fetch(`http://peer.cesi/api/service/${soldServiceData.base_service_id}`);
              if (baseServiceResponse.ok) {
                const baseServiceData = await baseServiceResponse.json();
                const prestaResponse = await fetch(`http://peer.cesi/api/user/find/${baseServiceData.presta_id}`);
                if (prestaResponse.ok) {
                  const prestaData = await prestaResponse.json();
                  services.value.push({
                    ...baseServiceData,
                    _id: soldServiceData._id,
                    advancement: soldServiceData.advancement,
                    presta: {
                      nom: prestaData.nom,
                      prenom: prestaData.prenom,
                      email: prestaData.email,
                    }
                  });
                }
              }
            }
          }
        } catch (error) {
            console.error('Erreur lors de la récupération des services achetés:', error);
            errorMessage.value = 'Erreur lors de la récupération des services achetés.';
        } finally {
            loading.value = false;
        }
      });
  
      return { services, loading, errorMessage };
    },
  });
  </script>
  
  <style scoped>
h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

li:hover {
  transform: scale(1.02);
}

p {
  margin: 10px 0;
  color: #34495e;
  line-height: 1.6;
}

strong {
  color: #2c3e50;
}

div[v-else] {
  text-align: center;
  color: #34495e;
}

@media (min-width: 768px) {
  ul {
    display: flex;
    flex-wrap: wrap;
  }

  li {
    width: calc(50% - 40px);
    margin: 20px;
  }
}

@media (min-width: 1024px) {
  li {
    width: calc(33.333% - 40px);
  }
}
</style>
