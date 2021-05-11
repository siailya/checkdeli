import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: "*",
        redirect: "/404"
    },
    {
        path: '/',
        name: 'Index',
        component: () => import("../views/Home"),
        meta: {
            title: null
        },
    },
    {
        path: "/home",
        name: "Home",
        component: () => import("../views/CDUserHome"),
        meta: {
            title: "Чекдели - профиль"
        }
    },
    {
        path: "/404",
        name: "NotFound",
        component: () => import("../views/NotFound"),
        meta: {
            title: "Ничего не нашлось"
        }
    },
    {
        path: '/addusers',
        name: 'AddUsers',
        component: () => import("../views/AddUsers"),
        meta: {
            title: "Добавить пользователя"
        }
    },
    {
        path: "/calculating",
        name: "Calculating",
        component: () => import("../views/Calculating"),
        meta: {
            title: "Добавить позицию"
        }
    },
    {
        path: "/results/:storestring?",
        name: "Results",
        component: () => import("../views/Results"),
        meta: {
            title: "Чекдели - результаты"
        }
    },
    {
        path: "/register",
        name: "Registration",
        component: () => import("../views/Registration"),
        meta: {
            title: "Чекдели - регистрация"
        }
    },
    {
        path: "/vk",
        name: "VKLogin",
        component: () => import("../views/WithLogin"),
        meta: {
            title: "Логинимся через ВК"
        }
    },
    {
        path: "/ya",
        name: "YaLogin",
        component: () => import("../views/WithLogin"),
        meta: {
            title: "Логинимся через Яндекс"
        }
    },
    {
        path: "/gl",
        name: "GoogleLogin",
        component: () => import("../views/WithLogin"),
        meta: {
            title: "Логинимся через Google"
        }
    }
]

const router = new VueRouter({
    mode: "history",
    routes
})

const DEFAULT_TITLE = 'Чекдели - разделить чек с друзьями!';
router.afterEach((to) => {
    Vue.nextTick(() => {
        document.title = to.meta.title || DEFAULT_TITLE;
    });
});

export default router
