import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import InscriptionPage from '../views/RegistrationView.vue';
import LoginPage from '../views/LoginView.vue';
import HomePage from "../views/HomeView.vue";
import ParamPage from '../views/ParamView.vue';
import CreateServicePage from '../views/CreateServiceView.vue';
import DisplayServiceView from '../views/DisplayServiceView.vue';

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
        path: '/home',
        name: 'Home',
        component: HomePage, // Assurez-vous que HomeView est importé correctement
        beforeEnter: (to, from, next) => {
            // Vérifiez si l'utilisateur a un token d'accès
            if (localStorage.getItem('access_token')) {
                next();
            } else {
                next({ name: 'Login' }); // Redirige vers la page de connexion si aucun token n'est trouvé
            }
        },
    },
    {
        path: '/service',
        name: 'Service',
        component: CreateServicePage,
    },
    {
        path: '/parameters',
        name: 'Parameters',
        component: ParamPage,
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem('access_token')) {
                next();
            } else {
                next({ name: 'Login' }); // Redirige vers la page de connexion si aucun token n'est trouvé
            }
        },
    },
    {
        path: '/service/:service_id',
        name: 'DisplayService',
        component: DisplayServiceView,
        props: true,
      },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;