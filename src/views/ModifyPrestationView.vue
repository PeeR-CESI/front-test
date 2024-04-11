<template>
  <div class="modify-prestation">
    <h2>Modifier vos Prestations</h2>
    <form @submit.prevent="updatePrestation">
      <div>
        <label for="name">Nom de la prestation:</label>
        <input id="name" v-model="name" type="text" required>
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>
      <div>
        <label for="price">Prix:</label>
        <input id="price" v-model="price" type="number" required>
      </div>
      <div>
        <label for="status">Statut:</label>
        <select id="status" v-model="status" required>
          <option value="en attente">En attente</option>
          <option value="en cours">Validé</option>
          <option value="en cours">Refusé</option>
          <option value="terminé">Terminé</option>
        </select>
      </div>
      <div>
        <label for="advancement">Avancement:</label>
        <select id="advancement" v-model="advancement" required>
          <option value="1">1 - En attente</option>
          <option value="2">2 - En cours</option>
          <option value="3">3 - Avancé</option>
          <option value="4">4 - Presque terminé</option>
          <option value="5">5 - Terminé</option>
        </select>
      </div>
      <button type="submit">Mettre à jour la prestation</button>
    </form>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const name = ref('');
    const description = ref('');
    const price = ref(0);
    const status = ref('');
    const advancement = ref(1);
    const router = useRouter();
    const route = useRoute();
    const soldServiceId = route.params.sold_service_id;

    const fetchPrestationDetails = async () => {
      const response = await fetch(`http://peer.cesi/api/service/sell/${soldServiceId}`);
      if (response.ok) {
        const data = await response.json();
        name.value = data.name;
        description.value = data.description;
        price.value = data.price;
        status.value = data.status;
        advancement.value = data.advancement;
      } else {
        console.error('Erreur lors de la récupération de la prestation');
      }
    };

    watch(advancement, (newValue) => {
      switch (newValue) {
        case 1:
          status.value = 'en attente';
          break;
        case 5:
          status.value = 'terminé';
          break;
        default:
          break;
      }
    });

    const updatePrestation = async () => {
      try {
        const response = await fetch(`http://peer.cesi/api/service/sell/${soldServiceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.value,
            description: description.value,
            price: price.value,
            status: status.value,
            advancement: advancement.value,
          }),
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de la mise à jour de la prestation: ${response.status}`);
        }

        alert('Prestation mise à jour avec succès!');
        router.push(`/prestations/display/${soldServiceId}`);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Erreur lors de la mise à jour de la prestation:', error.message);
          alert(`Erreur lors de la mise à jour de la prestation: ${error.message}`);
        }
      }
    };

    onMounted(fetchPrestationDetails);

    return {
      name,
      description,
      price,
      status,
      advancement,
      updatePrestation,
    };
  },
});
</script>

  
<style scoped>
.modify-prestation {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.modify-prestation h2 {
  color: #30475e;
  margin-bottom: 1.5rem;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

form > div {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

label {
  margin-bottom: .5rem;
  color: #30475e;
}

input[type="text"],
textarea,
input[type="number"],
select {
  padding: .8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.form-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-group label {
  flex-basis: 20%;
  margin-bottom: 0;
}

.form-group input,
.form-group select,
.form-group textarea {
  flex-basis: 75%;
}

button {
  padding: .8rem 2rem;
  margin-top: .5rem;
  color: #fff;
  background-color: #30475e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #1b2a49;
}
</style>
