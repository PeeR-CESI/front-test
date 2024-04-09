<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input id="username" v-model="credentials.username" type="text" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input id="password" v-model="credentials.password" type="password" required>
      </div>
      <button type="submit">Login</button>
      <div v-if="error">
        <p>{{ errorMessage }}</p>
      </div>
      <button @click="goToInscription">Inscription</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from "vue-router";

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const credentials = ref({
      username: '',
      password: '',
    });
    const error = ref(false);
    const errorMessage = ref('');

    const goToInscription = () => {
      router.push('/inscription');
    };

    const login = async () => {
      error.value = false;
      errorMessage.value = '';

      try {
        const response = await fetch('http://peer.cesi:5000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials.value),
        });

        if (!response.ok) {
          throw response;
        }

        const data = await response.json();
        // Stockez ici vos tokens dans localStorage ou dans un état global
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user_id', data.user_id);
        // Redirection vers la page d'accueil
        router.push('/home');
      } catch (err) {
        error.value = true;
        if (err instanceof Response) {
          if (err.status === 404) {
            errorMessage.value = 'Nom d’utilisateur non trouvé.';
          } else if (err.status === 401) {
            errorMessage.value = 'Mot de passe incorrect.';
          } else {
            errorMessage.value = 'Erreur lors de la connexion.';
          }
        } else {
          errorMessage.value = 'Une erreur inconnue est survenue.';
        }
      }
    };

    return {
      credentials,
      error,
      errorMessage,
      login,
      goToInscription,
    };
  },
});
</script>

<style scoped>
/* Vos styles ici */
</style>
