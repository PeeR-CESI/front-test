<template>
  <div class="home">
    <h1>Bienvenue, {{ username }}</h1>
    <button @click="goToSettings">Paramètres</button>
    <!-- Bouton pour ouvrir le pop-up de parrainage -->
    <button @click="showSponsorModal = true">Parrainer un ami</button>

    <!-- Pop-up de parrainage -->
    <div v-if="showSponsorModal" class="modal">
      <h2>Parrainer un ami pour bénéficier d'avantages exclusifs</h2>
      <p>Parrainer un ami pour bénéficier d'avantages exclusifs tels que la mise en avant de vos services sur notre site ou -10% sur votre prochaine achat.</p>
      <input v-model="sponsorEmail" type="email" placeholder="Email de l'ami" />
      <button @click="sendSponsorEmail">Envoyer</button>
      <button @click="showSponsorModal = false">Fermer</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter();
    const username = computed(() => localStorage.getItem('username'));

    const goToSettings = () => {
      router.push('/parameters');
    };
    const showSponsorModal = ref(false);
    const sponsorEmail = ref('');

    const sendSponsorEmail = async () => {
      try {
        const response = await fetch('http://peer.cesi:5000/sponsor/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: sponsorEmail.value }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'envoi de l\'email');
        }

        // Réinitialisation pour fermer le pop-up et nettoyer le champ email
        showSponsorModal.value = false;
        sponsorEmail.value = '';

        alert('Email envoyé avec succès');
      } catch (error) {
        console.error(error);
        alert('Erreur lors de l\'envoi de l\'email');
      }
    };

    return {
      username,
      goToSettings,
      showSponsorModal,
      sponsorEmail,
      sendSponsorEmail,
    };
  },
});
</script>

<style scoped>
.modal {
  /* Style de base pour le pop-up, à ajuster selon vos besoins */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
