/*
Vue "Détails du Service" :
- Cette vue affiche les détails d'un service spécifique, accessible par son ID. Les informations affichées incluent le nom, la description et le prix du service.
- Elle est capable de gérer les situations où le service est en cours de chargement ou n'a pas été trouvé, en affichant un message approprié à l'utilisateur.
- Un bouton permet à l'utilisateur d'acheter le service affiché, déclenchant une série d'opérations côté serveur pour enregistrer cette transaction.

Conditions préalables :
- Aucune condition spécifique pour visualiser les détails du service, mais pour acheter un service, l'utilisateur doit être connecté et avoir un ID utilisateur valide stocké localement.

Fonctionnalités :
- Récupération des détails du service depuis l'API à l'aide de l'ID fourni dans l'URL ou en tant que prop.
- Fonctionnalité d'achat qui envoie une requête pour marquer le service comme vendu, met à jour les enregistrements de l'utilisateur (demandeur et prestataire) avec l'ID du service vendu, et affiche un message de confirmation ou d'erreur selon le résultat de l'opération.

Sécurité :
- Validation côté client pour s'assurer que l'ID du service est fourni et est valide avant d'effectuer la requête de détails.
- Mesures de sécurité supplémentaires devraient être prises côté serveur pour vérifier l'authenticité des requêtes d'achat.

Résultat attendu :
- Les utilisateurs peuvent visualiser les détails complets d'un service.
- En cas de succès de l'achat, l'utilisateur reçoit une confirmation, et les enregistrements sont mis à jour en conséquence. En cas d'échec, un message d'erreur est affiché pour informer l'utilisateur du problème.
*/

<template>
  <div v-if="service">
    <h2>Détails du Service</h2>
    <p><strong>Nom:</strong> {{ service.nom }}</p>
    <p><strong>Description:</strong> {{ service.description }}</p>
    <p><strong>Prix:</strong> {{ service.price }}</p>
    
    <button v-if="isOwnerOrAdmin" @click="navigateToModifyService">Modifier le service</button>
    
    <button v-if="isOwnerOrAdmin" @click="deleteServiceConfirmation" class="delete-button">Supprimer le service</button>
    <button v-if="service && !isOwnerOrAdmin" @click="buyService">Acheter ce service</button>
  </div>
  <div v-else>
    <p>Chargement des détails du service ou service non trouvé...</p>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, onMounted, ref, Ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface Service {
  _id: string;
  nom: string;
  description: string;
  price: string;
  presta_id: string;
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
  name: 'DisplayServiceView',
  props: {
      service_id: String
  },
  setup(props) {
    const service: Ref<Service | null> = ref(null);
    const router = useRouter();
    const route = useRoute();
    let userId = '';
    let userRole = '';

    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = decodeToken(token);
      userId = decoded.user_id;
      userRole = decoded.role;
    }

    const isOwnerOrAdmin = computed(() => {
      return service.value?.presta_id === userId || userRole === 'admin';
    });
  
    const fetchServiceDetails = async () => {
      try {
        const serviceId = route.params.service_id;
        const response = await fetch(`http://peer.cesi/api/service/${serviceId}`);
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération du service: ${response.status}`);
        }
        const data = await response.json();
        service.value = data;
      } catch (error) {
        console.error('Erreur lors de la récupération du service:', error instanceof Error ? error.message : error);
        service.value = null;
      }
    };
  
    const buyService = async () => {
      if (!service.value) return;
      const userId = localStorage.getItem('user_id');
      
      if (!userId) {
        alert("Vous devez vous connecter pour acheter un service.");
        router.push('/login');
        return;
      }
      
      try {
          const sellResponse = await fetch('http://peer.cesi/api/service/sell/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: service.value._id,
              demandeur_id: userId,
              advancement: 0,
            }),
          });

          if (!sellResponse.ok) throw new Error('Problème lors de la vente du service.');
          const { sold_service_id } = await sellResponse.json();
            
          // 2. Récupérer les infos de l'utilisateur (demandeur)
          const userResponse = await fetch(`http://peer.cesi/api/user/find/${userId}`);
          if (!userResponse.ok) throw new Error('Problème lors de la récupération des infos utilisateur.');
          const userInfo = await userResponse.json();

          // 3. Mettre à jour les infos de l'utilisateur (demandeur) avec le nouveau sold_service_id
          const updatedSoldServiceIds = userInfo.sold_service_ids ? [...userInfo.sold_service_ids, sold_service_id] : [sold_service_id];
          await fetch(`http://peer.cesi/api/user/update/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userInfo, sold_service_ids: updatedSoldServiceIds }),
          });

          // 4. Mettre à jour le prestataire avec le nouveau sold_service_id
          if (service.value && service.value.presta_id) {
              const prestaId = service.value.presta_id; // ID du prestataire
              const prestaResponse = await fetch(`http://peer.cesi/api/user/find/${prestaId}`);
              if (!prestaResponse.ok) throw new Error('Problème lors de la récupération des infos du prestataire.');
              const prestaInfo = await prestaResponse.json();

              const updatedPrestaSoldServiceIds = prestaInfo.sold_service_ids ? [...prestaInfo.sold_service_ids, sold_service_id] : [sold_service_id];
              await fetch(`http://peer.cesi/api/user/update/${prestaId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...prestaInfo, sold_service_ids: updatedPrestaSoldServiceIds }),
              });
            }

          alert('Service acheté avec succès!');
          router.push('/myorders');
        } catch (error) {
          if (error instanceof Error) {
            alert('Erreur lors de l\'achat du service: ' + error.message);
          } else {
            alert('Erreur lors de l\'achat du service: ' + String(error));
          }
        }
    };

    const navigateToModifyService = () => {
      if (service.value?._id) {
        router.push({ name: 'ModifyService', params: { service_id: service.value._id } });
      }
    };

    const deleteServiceConfirmation = async () => {
      if (service.value?._id && confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
        try {
          // Étape 1: Suppression du service
          const deleteResponse = await fetch(`http://peer.cesi/api/service/delete/${service.value._id}`, {
            method: 'DELETE'
          });
          if (!deleteResponse.ok) {
            throw new Error('Erreur lors de la suppression du service');
          }
          
          // Étape 2: Récupération des informations actuelles du prestataire
          const prestaResponse = await fetch(`http://peer.cesi/api/user/find/${service.value.presta_id}`);
          if (!prestaResponse.ok) throw new Error('Erreur lors de la récupération des infos du prestataire.');
          const prestaInfo = await prestaResponse.json();
          
          // Étape 3: Mise à jour de la liste des `service_ids` sans l'ID du service supprimé
          const updatedServiceIds = prestaInfo.service_ids.filter((id: string) => id !== service.value!._id);

          
          // Étape 4: Mise à jour des informations du prestataire avec la nouvelle liste des `service_ids`
          const updateResponse = await fetch(`http://peer.cesi/api/user/update/${service.value.presta_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...prestaInfo, service_ids: updatedServiceIds }),
          });
          if (!updateResponse.ok) throw new Error('Erreur lors de la mise à jour du prestataire.');

          alert('Service supprimé avec succès.');
          router.push('/myservices');
        } catch (error) {
          console.error(error);
          alert('Erreur lors de la suppression du service.');
        }
      }
    };


    onMounted(fetchServiceDetails);

    return {
      service,
      buyService,
      isOwnerOrAdmin,
      navigateToModifyService,
      deleteServiceConfirmation,
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
  margin-right: 10px;
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
</style>

