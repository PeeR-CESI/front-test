import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import InscriptionPage from '../views/RegistrationView.vue';
import LoginPage from '../views/LoginView.vue';
import HomeView from "../views/HomeView.vue"; 
import CreateServiceView from '../views/CreateServiceView.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
    },
    {
        path: '/inscription',
        name: 'Inscription',
        component: InscriptionPage,
    },
    {
        path: '/',
        name: 'Home',
        component: HomeView,
        beforeEnter: (to, from, next) => {
            // Vérifie si l'utilisateur a un token d'accès
            if (localStorage.getItem('access_token')) {
                next();
            } else {
                next({name: 'Login'}); // Redirige vers la page de connexion si aucun token n'est trouvé
            }
        },
    },
    {
        path: '/service-creation',
        name: 'Création d\'un service',
        component: CreateServiceView,
        beforeEnter: (to, from, next) => {
            // Vérifiez si l'utilisateur a un token d'accès
            if (localStorage.getItem('access_token')) {
                next();
            } else {
                next({name: 'Login'}); // Redirige vers la page de connexion si aucun token n'est trouvé
            }
        },
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
