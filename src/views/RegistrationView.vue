<template>
  <div class="registration-container">
    <div class="registration-box">
      <img :src="logoPath" alt="Logo" class="logo"/>
      <h2>Inscription</h2>
      <form @submit.prevent="createUser" class="form">
        <div class="form-group">
          <input v-model="nom" type="text" placeholder="Nom" class="input-field"/>
        </div>
        <div class="form-group">
          <input v-model="prenom" type="text" placeholder="Prénom" class="input-field"/>
        </div>
        <div class="form-group">
          <input v-model="email" type="email" placeholder="Email" class="input-field"/>
        </div>
        <div class="form-group">
          <input v-model="adresse" type="text" placeholder="Adresse" class="input-field"/>
        </div>
        <div class="form-group">
          <select v-model="role" class="input-field">
            <option value="demandeur">Demandeur</option>
            <option value="presta">Prestataire</option>
          </select>
        </div>
        <div class="form-group">
          <input v-model="username" type="text" placeholder="Username" class="input-field"/>
        </div>
        <div class="form-group">
          <input v-model="password" type="password" placeholder="Password" class="input-field"/>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn">S'inscrire</button>
        </div>
        <div class="form-actions">
          <p>Déjà un compte ? Connecte toi :</p>
          <button type="submit" class="btn" @click="goToLogin" >Connexion</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import router from "../router";
import logoPath from '../assets/image.png';


export default defineComponent({
  name: 'InscriptionPage',
  setup() {
    const nom = ref('');
    const prenom = ref('');
    const email = ref('');
    const adresse = ref('');
    const role = ref('demandeur');
    const username = ref('');
    const password = ref('');

    const createUser = async () => {
      try {
        const response = await fetch('http://peer.cesi/api/user/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nom: nom.value,
            prenom: prenom.value,
            email: email.value,
            adresse: adresse.value,
            role: role.value,
            username: username.value,
            password: password.value,
          }),
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }

        const userData  = await response.json();
        console.log('Utilisateur créé:', userData );
        router.push('/login');

      } catch (error) {
        console.error('Erreur:', error);
      }

    };

    const goToLogin = () => {
      router.push('/login');
    };


    return {
      nom,
      prenom,
      email,
      adresse,
      role,
      username,
      password,
      createUser,
      logoPath,
      goToLogin
    };
  },
});
</script>

<style scoped>
.registration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f2f2f2;
}

.registration-box {
  padding: 2rem;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.logo {
  width: 150px;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.input-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-actions {
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  background-color: #0055ff;
  color: white;
}
</style>
