/*
Vue "Services Achetés" :
- Cette vue est conçue pour les utilisateurs ayant le rôle de "demandeur". Elle affiche une liste des services que l'utilisateur a achetés précédemment.
- La vue commence par vérifier si l'utilisateur est connecté et a le rôle approprié. En cas de non-conformité, un message d'erreur est affiché et l'utilisateur est redirigé.
- Si les conditions sont remplies, la vue récupère la liste des ID des services achetés par l'utilisateur et fait une requête à l'API pour chaque service afin de récupérer et afficher ses détails, ainsi que les informations du prestataire correspondant.

Conditions préalables :
- L'utilisateur doit être connecté et avoir le rôle de "demandeur".
- Les ID des services achetés doivent être enregistrés et associés à l'utilisateur.

Fonctionnalités :
- Récupération et affichage des détails des services achetés, y compris les informations du prestataire de chaque service.
- Gestion des états de chargement et d'erreur, avec affichage de messages appropriés selon la situation (par exemple, "Chargement des services...", "Aucun service acheté trouvé", ou messages d'erreur spécifiques).

Sécurité :
- Vérification de l'authenticité de l'utilisateur et de son autorisation à accéder à cette page, basée sur le rôle et l'ID stockés dans le token JWT.
- Validation côté serveur pour s'assurer que les requêtes de récupération des informations des services et des prestataires sont légitimes.

Résultat attendu :
- L'utilisateur visualise une liste des services qu'il a achetés avec leurs détails complets. En cas d'échec de la récupération des données, un message d'erreur est affiché pour informer l'utilisateur de la situation.
*/

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
            // Pas besoin de récupérer les détails du service de base séparément
            const prestaResponse = await fetch(`http://peer.cesi/api/user/find/${soldServiceData.presta_id}`);
            if (prestaResponse.ok) {
              const prestaData = await prestaResponse.json();
              services.value.push({
                _id: soldServiceData._id,
                nom: soldServiceData.name,
                description: soldServiceData.description,
                price: Number(soldServiceData.price),
                presta: {
                  nom: prestaData.nom,
                  prenom: prestaData.prenom,
                  email: prestaData.email,
                }
              });
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
