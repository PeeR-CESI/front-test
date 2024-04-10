<template>
  <div>
    <h2>Créer mon service</h2>
    <form @submit.prevent="createService">
      <div>
        <label for="nom">Nom du service:</label>
        <input id="nom" v-model="nom" type="text" required>
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>
      <div>
        <label for="price">Prix:</label>
        <input id="price" v-model="price" type="text" required>
      </div>
      <button type="submit">Créer mon service</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import router from "../router";

// Explicitly type the parameter `token` to resolve TS7006
function decodeToken(token: string): any { // Consider specifying a more precise return type than `any`
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  
  return JSON.parse(jsonPayload);
}

export default defineComponent({
  name: 'CreateServicePage',
  setup() {
    const nom = ref('');
    const description = ref('');
    const price = ref('');
    const userId = ref('');

    onMounted(() => {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Since decodeToken now requires a string, TypeScript won't complain here
        const decoded = decodeToken(token);
        userId.value = decoded.user_id; // Assuming the JWT token contains `user_id`
        if (decoded.role === "demandeur") {
          alert("Vous n'êtes pas prestataire, vous ne pouvez pas créer de service");
          router.push('/');
        }
      }
    });

    const createService = async () => {
      try {
        const response = await fetch('http://peer.cesi/api/service/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nom: nom.value,
            description: description.value,
            price: price.value,
            presta_id: userId.value,
          }),
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }

        const { service_id } = await response.json();
        console.log('Service créé avec succès:', service_id);
        await updatePrestaServices(service_id);

        window.alert('Service créé avec succès!');
        router.push(`/service/display/${service_id}`);
      } catch (error: unknown) { // Properly handle error of type unknown
        if (error instanceof Error) {
          console.error('Erreur lors de la création du service:', error);
          window.alert(`Erreur lors de la création du service: ${error.message}`);
        }
      }
    };

    // Explicitly type the parameter `newServiceId` to resolve TS7006
    const updatePrestaServices = async (newServiceId: string) => {
      try {
        const userInfoResponse = await fetch(`http://peer.cesi/api/user/find/${userId.value}`);
        if (!userInfoResponse.ok) {
          throw new Error('Impossible de récupérer les informations de l\'utilisateur.');
        }
        const userInfo = await userInfoResponse.json();

        let updatedServiceIds = userInfo.service_ids || [];
        updatedServiceIds.push(newServiceId);

        const updateUserResponse = await fetch(`http://peer.cesi/api/user/update/${userId.value}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...userInfo, service_ids: updatedServiceIds }),
        });

        if (!updateUserResponse.ok) {
          throw new Error('Mise à jour des services de l\'utilisateur échouée.');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Erreur lors de la mise à jour des services de l\'utilisateur:', error);
        }
      }
    };

    return {
      nom,
      description,
      price,
      createService,
    };
  },
});
</script>

<style scoped>
/* Styles conservés tels quels */
form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  align-self: center;
}

button:hover {
  background-color: #0056b3;
}
</style>
