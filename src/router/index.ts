import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import RegistrationPage from '../views/RegistrationView.vue';
import LoginPage from '../views/LoginView.vue';
import HomePage from "../views/HomeView.vue";
import AccountParameterPage from '../views/ParamView.vue';
import CreateServicePage from '../views/CreateServiceView.vue';
import DisplayServicePage from '../views/DisplayServiceView.vue';
import ModifyServicePage from '../views/ModifyServiceView.vue';
import BoughtServicePage from "../views/BoughtServiceView.vue";
import UserListPage from '../views/UserListView.vue';
import UserDetailsPage from '../views/UserDetailsView.vue';
import SoldServicePage from "../views/SoldServiceView.vue";
import MyServicesPage from "../views/MyServicesView.vue";
import ForumPage from "../views/ForumView.vue";
import ModifyPrestationsPage from "../views/ModifyPrestationView.vue";
import DisplayPrestationsPage from "../views/DisplayPrestationView.vue";
import StatisticsPage from "../views/StatisticsView.vue";

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
        path: '/register',
        name: 'Register',
        component: RegistrationPage,
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
        path: '/account/parameters',
        name: 'Parameters',
        component: AccountParameterPage,
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem('access_token')) {
                next();
            } else {
                next({ name: 'Login' }); // Redirige vers la page de connexion si aucun token n'est trouvé
            }
        },
    },
    {
        path: '/admin/statistics', // Redirige les admins vers la page de statistiques d'utilisation de la plateforme
        name: 'Statistics',
        component: StatisticsPage,
    },
    {
        path: '/service/create',
        name: 'ServiceCreate',
        component: CreateServicePage,
        props: true,
    },
    {
        path: '/service/display/:service_id',
        name: 'DisplayService',
        component: DisplayServicePage,
        props: true,
    },
    {
        path: '/service/update/:service_id',
        name: 'ModifyService',
        component: ModifyServicePage,
        props: true,
    },
    {
        path: '/myorders',
        name: 'MyOrders',
        component: BoughtServicePage,
        props: true,
    },
    {
        path: '/myprestations',
        name: 'MyPrestations',
        component: SoldServicePage,
        props: true,
    },
    {
        path: '/user-list',
        name: 'UserList',
        component: UserListPage,
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem('access_token')) {
                next();
            } else {
                next({ name: 'Login' }); // Redirige vers la page de connexion si aucun token n'est trouvé
            }
        },
    },
    {
        path: '/user-details/:id',
        name: 'UserDetails',
        component: UserDetailsPage,
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem('access_token')) {
                next();
            } else {
                next({ name: 'Login' }); // Redirige vers la page de connexion si aucun token n'est trouvé
            }
        },
    },
    {
        path: '/myservices',
        name: 'MyServices',
        component: MyServicesPage,
    },
    {
        path: '/prestations/update/:sold_service_id',
        name: 'ModifyPrestations',
        component: ModifyPrestationsPage,
    },
    {
        path: '/prestations/display/:sold_service_id',
        name: 'DisplayPrestations',
        component: DisplayPrestationsPage,
    },
    {
        path: '/forum',
        name: 'Forum',
        component: ForumPage,
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem('access_token')) {
                next();
            } else {
                next({ name: 'Login' }); // Redirige vers la page de connexion si aucun token n'est trouvé
            }
        },
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
