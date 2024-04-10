<template>
    <div v-if="soldService">
      <h2>Détails de la Prestation</h2>
      <p><strong>Nom:</strong> {{ soldService.name }}</p>
      <p><strong>Description:</strong> {{ soldService.description }}</p>
      <p><strong>Prix:</strong> {{ soldService.price }}</p>
      <p><strong>Statut:</strong> {{ soldService.status }}</p>
      <p><strong>Avancement:</strong> {{ soldService.advancement }}%</p>
      
      <!-- Bouton pour actions spécifiques à la prestation -->
      <!-- Exemple : Modifier ou Supprimer la prestation, si l'utilisateur est le propriétaire ou l'admin -->
      <button v-if="isOwnerOrAdmin" @click="modifyPrestation">Modifier la prestation</button>
      <button v-if="isOwnerOrAdmin" @click="deletePrestationConfirmation" class="delete-button">Supprimer la prestation</button>
    </div>
    <div v-else>
      <p>Chargement des détails de la prestation ou prestation non trouvée...</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface SoldService {
  _id: string;
  name: string;
  description: string;
  price: string;
  status: string;
  advancement: number;
  presta_id: string;
  demandeur_id: string;
}

function decodeToken(token: string): any { 
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  
  return JSON.parse(jsonPayload);
}

export default defineComponent({
  name: 'DisplayPrestationView',
  props: {
    sold_service_id: String
  },
  setup(props) {
    const soldService: Ref<SoldService | null> = ref(null);
    const router = useRouter();
    const route = useRoute();
    const userId = ref('');
    const userRole = ref('');

    // Utiliser le token pour définir userId et userRole
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = decodeToken(token);
      userId.value = decoded.user_id;
      userRole.value = decoded.role;
    }

    const isOwnerOrAdmin = computed(() => {
      return soldService.value?.presta_id === userId.value || userRole.value === 'admin';
    });

    const fetchSoldServiceDetails = async () => {
      try {
        const soldServiceId = props.sold_service_id || route.params.sold_service_id;
        const response = await fetch(`http://peer.cesi/api/service/sell/${soldServiceId}`);
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération de la prestation: ${response.status}`);
        }
        const data = await response.json();
        soldService.value = data;
      } catch (error) {
        console.error('Erreur lors de la récupération de la prestation:', error);
        soldService.value = null;
      }
    };

    const modifyPrestation = () => {
        if (soldService.value?._id) {
            router.push({ name: 'ModifyPrestations', params: { sold_service_id: soldService.value._id } });
        } else {
            console.error("ID de la prestation vendue est manquant.");
        }
    };


    const deletePrestation = async () => {
        if (!soldService.value || !confirm('Êtes-vous sûr de vouloir supprimer cette prestation ?')) return;
        
        try {
            // Suppression de la prestation
            const deleteResponse = await fetch(`http://peer.cesi/api/service/sell/${soldService.value._id}`, {
            method: 'DELETE'
            });
            if (!deleteResponse.ok) throw new Error('Erreur lors de la suppression de la prestation');

            // Suppression du sold_service_id de la liste du prestataire
            await removeSoldServiceId(soldService.value.presta_id, soldService.value._id);

            // Suppression du sold_service_id de la liste du demandeur
            if (soldService.value.demandeur_id) {
            await removeSoldServiceId(soldService.value.demandeur_id, soldService.value._id);
            }

            alert('Prestation supprimée avec succès.');
            router.push('/myprestations'); // Rediriger vers l'accueil ou une autre page appropriée
        } catch (error) {
            if (error instanceof Error) {
            alert('Erreur lors de la suppression de la prestation: ' + error.message);
            } else {
            alert('Erreur lors de la suppression de la prestation.');
            }
        }
        };
    // Fonction pour supprimer le sold_service_id des sold_service_ids de l'utilisateur (prestataire ou demandeur)
    async function removeSoldServiceId(userId: string, soldServiceId: string) {
        const userResponse = await fetch(`http://peer.cesi/api/user/find/${userId}`);
        if (!userResponse.ok) throw new Error('Erreur lors de la récupération des infos de l’utilisateur.');

        const userInfo = await userResponse.json();
        const updatedSoldServiceIds = userInfo.sold_service_ids.filter((id: string) => id !== soldServiceId);

        const updateResponse = await fetch(`http://peer.cesi/api/user/update/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userInfo, sold_service_ids: updatedSoldServiceIds }),
        });
        if (!updateResponse.ok) throw new Error('Erreur lors de la mise à jour de l’utilisateur.');
    }

    onMounted(fetchSoldServiceDetails);

    return {
      soldService,
      isOwnerOrAdmin,
      modifyPrestation,
      deletePrestationConfirmation: deletePrestation,
    };
  },
});
</script>


<style scoped>
/* Conteneur principal pour un alignement centré et un design épuré */
div {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Style des titres pour plus de visibilité */
h2 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

/* Amélioration de la lisibilité du texte */
p {
  color: #666;
  line-height: 1.6;
  margin: 10px 0;
}

/* Mise en évidence des éléments clés */
strong {
  color: #333;
}

/* Style des boutons pour une meilleure interaction utilisateur */
button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px;
}

/* Style spécifique pour le bouton supprimer */
.delete-button {
  background-color: #dc3545; /* Rouge par défaut pour le bouton Supprimer */
}

.delete-button:hover {
  background-color: #c82333; /* Rouge plus foncé au survol */
}

button:hover {
  background-color: #0056b3;
}
</style>
