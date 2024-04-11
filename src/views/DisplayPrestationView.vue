<template>
  <div v-if="soldService">
    <h2>Détails de la Prestation</h2>
    <p><strong>Nom:</strong> {{ soldService.name }}</p>
    <p><strong>Description:</strong> {{ soldService.description }}</p>
    <p><strong>Prix:</strong> {{ soldService.price }}</p>
    <p><strong>Statut:</strong> {{ soldService.status }}</p>
    <p><strong>Avancement:</strong></p>
    <div class="progress-container">
      <div :class="`progress-bar level-${soldService.advancement}`"></div>
    </div>
    <button v-if="canValidateOrRefuse && soldService.status === 'en attente'" @click="updateStatus('validé')">Valider</button>
    <button v-if="canValidateOrRefuse && soldService.status === 'en attente'" @click="updateStatus('refusé')">Refuser</button>
    <button v-if="canModify" @click="modifyPrestation">Modifier la demande</button>
    <button v-if="canDelete" @click="deletePrestationConfirmation" class="delete-button">Supprimer la prestation</button>
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


    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = decodeToken(token);
      userId.value = decoded.user_id;
      userRole.value = decoded.role;
    }

    const canValidateOrRefuse = computed(() => {
      return (userRole.value === 'presta') && soldService.value?.status === 'en attente';
    });

    const canModify = computed(() => {
      if (userRole.value === 'admin') {
        return true;
      }
      if (userRole.value === 'demandeur' && soldService.value?.status === 'en attente') {
        return true;
      }
      if (userRole.value === 'presta' && (soldService.value?.status === 'validé' || soldService.value?.status === 'en cours')) {
        return true;
      }
      return false;
    });

    const canDelete = computed(() => {
      if (userRole.value === 'admin') {
        return true;
      }
      if (userRole.value === 'demandeur' && soldService.value?.status === 'en attente') {
        return true;
      }
      return false;
    });

    const fetchSoldServiceDetails = async () => {
    try {
      const soldServiceId = props.sold_service_id || route.params.sold_service_id;
      const response = await fetch(`http://peer.cesi/api/service/sell/${soldServiceId}`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de la prestation: ${response.status}`);
      }
      const data = await response.json();
      data.advancement = data.advancement || 1; // S'assurer que 'advancement' a une valeur minimale de 1
      soldService.value = data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la prestation:', error);
      soldService.value = null;
    }
  };

    const updateStatus = async (newStatus: 'validé' | 'refusé') => {
      try {
        const response = await fetch(`http://peer.cesi/api/service/sell/${soldService.value?._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, advancement: soldService.value?.advancement }),
        });
        if (!response.ok) throw new Error('Échec de la mise à jour du statut de la prestation');
        await fetchSoldServiceDetails();
        alert(`La prestation a été ${newStatus}.`);
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        alert('Erreur lors de la mise à jour du statut de la prestation.');
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
            const deleteResponse = await fetch(`http://peer.cesi/api/service/sell/${soldService.value._id}`, {
            method: 'DELETE'
            });
            if (!deleteResponse.ok) throw new Error('Erreur lors de la suppression de la prestation');

            await removeSoldServiceId(soldService.value.presta_id, soldService.value._id);

            if (soldService.value.demandeur_id) {
            await removeSoldServiceId(soldService.value.demandeur_id, soldService.value._id);
            }

            alert('Prestation supprimée avec succès.');
            router.push('/myprestations');
        } catch (error) {
            if (error instanceof Error) {
            alert('Erreur lors de la suppression de la prestation: ' + error.message);
            } else {
            alert('Erreur lors de la suppression de la prestation.');
            }
        }
        };
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
      canValidateOrRefuse,
      canModify,
      canDelete,
      updateStatus,
      modifyPrestation,
      deletePrestationConfirmation: deletePrestation,
    };
  },
});
</script>


<style scoped>
div {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

p {
  color: #666;
  line-height: 1.6;
  margin: 10px 0;
}

strong {
  color: #333;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}
.delete-button {
  background-color: #dc3545;
}

.delete-button:hover {
  background-color: #c82333;
}

button:hover {
  background-color: #0056b3;
}

.progress-container {
  width: 95%;
  background-color: #e0e0e0; /* Couleur de fond pour le conteneur de la barre de progression */
  border-radius: 50px;
  margin-top: 10px; /* Espacement au-dessus de la barre de progression */
  position: relative; /* Positionnement relatif pour le conteneur */
}

.progress-bar {
  position: absolute; /* Positionnement absolu pour la barre elle-même */
  left: 0; /* Ancrage à gauche */
  top: 0; /* Ancrage en haut */
  margin-top: 1px;
  height: 1%; /* Hauteur ajustée pour visibilité */
  border-radius: 50px;
  transition: width 0.4s ease; /* Transition douce lors du changement de largeur */
}

/* Largeurs spécifiques pour chaque niveau ajustées pour la nouvelle structure */
.level-1 { width: 5%; background-color: #f9ff3e; }
.level-2 { width: 25%; background-color: #3e8bff; }
.level-3 { width: 45%; background-color: #3e8bff; }
.level-4 { width: 70%; background-color: #3e8bff; }
.level-5 { width: 95%; background-color: #4caf50; }
</style>