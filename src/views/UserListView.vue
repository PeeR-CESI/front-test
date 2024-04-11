<template>
  <div class="user-list">
    <div class="column prestataires">
      <h2>Prestataires</h2>
      <div class="user-card" v-for="user in prestataires" :key="user.id" @click="goToUserDetails(user.id)">
        <p>Rôle : {{ user.role }}</p>
        <p>Nom d'utilisateur : {{ user.username }}</p>
        <p>Email : {{ user.email }}</p>
      </div>
    </div>

    <div class="column demandeurs">
      <h2>Demandeurs</h2>
      <div class="user-card" v-for="user in demandeurs" :key="user.id" @click="goToUserDetails(user.id)">
        <p>Rôle : {{ user.role }}</p>
        <p>Nom d'utilisateur : {{ user.username }}</p>
        <p>Email : {{ user.email }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

interface User {
  id: number;
  role: string;
  username: string;
  email: string;
}

export default defineComponent({
  name: 'UserListView',
  setup() {
    const prestataires = ref<User[]>([]);
    const demandeurs = ref<User[]>([]);
    const router = useRouter();

    onMounted(async () => {
      try {
        const response = await fetch('http://peer.cesi/api/user/all');
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const users: User[] = await response.json();
        prestataires.value = users.filter(user => user.role === 'presta');
        demandeurs.value = users.filter(user => user.role === 'demandeur');
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    });

    const goToUserDetails = (userId: number) => {
      router.push(`/user-details/${userId}`);
    };

    return {
      prestataires,
      demandeurs,
      goToUserDetails,
    };
  },
});
</script>

<style scoped>
.user-list {
  display: flex;
  justify-content: space-around;
  background-color: #f5f5f5;
}

.column {
  flex: 1;
  padding: 0 1rem;
  margin: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.user-card {
  border: 1px solid #e0e0e0;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 5px;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

h2 {
  color: #333;
  font-family: 'Helvetica Neue', sans-serif;
  margin-bottom: 1rem;
}

p {
  color: #666;
  font-family: 'Arial', sans-serif;
  line-height: 1.5;
}
</style>
