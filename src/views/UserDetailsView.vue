<template>
  <div class="user-details">
    <h1>Détails de l'utilisateur: {{ presta }}</h1>
    <h3>Note moyenne: {{ average_rating.toFixed(1) }}</h3>
    <div class="reviews">
      <h2>Avis</h2>
      <div class="review-card" v-for="(review, index) in reviews" :key="index">
        <p>Note : {{ review.rating }}</p>
        <p>Commentaire : {{ review.comment }}</p>
      </div>
    </div>
    <div class="add-review">
      <h2>Ajouter un commentaire à cet utilisateur :</h2>
      <form @submit.prevent="addReview">
        <div>
          <label for="comment">Commentaire :</label>
          <input id="comment" v-model="newReview.comment" type="text" required>
        </div>
        <div>
          <label for="rating">Note :</label>
          <select id="rating" v-model.number="newReview.rating">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <button type="submit">Envoyer</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';

// Interface pour un avis
interface Review {
  rating: number;
  comment: string;
}

export default defineComponent({
  name: 'UserDetailsView',
  setup() {
    const route = useRoute();
    const presta = ref('');
    const average_rating = ref(0);
    const reviews = ref<Review[]>([]);
    const userId = route.params.id;

    const newReview = reactive({
      comment: '',
      rating: 5,
      presta_id: userId
    });

    const loadDetails = async () => {
      try {
        const response = await fetch(`http://peer.cesi/api/review/${userId}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        presta.value = data.presta;
        average_rating.value = parseFloat(data.average_rating.toFixed(1));
        reviews.value = data.reviews;
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de l’utilisateur:', error);
      }
    };

    onMounted(loadDetails);

    const addReview = async () => {
      try {
        const response = await fetch(`http://peer.cesi/api/review/add`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(newReview),
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        await loadDetails();

        newReview.comment = '';
        newReview.rating = 5;
      } catch (error) {
        console.error('Erreur lors de l’ajout du commentaire:', error);
      }
    };

    return { presta, average_rating, reviews, newReview, addReview };
  },
});
</script>

<style scoped>
.add-review { margin-top: 2rem; }
.review-card { border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem; }
</style>
