import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL || 8080,
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: Home,
        headerComponent: null,
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default () {
          return import(/* webpackChunkName: "about" */ './views/About.vue');
        },
        headerComponent () {
          return import('./components/Header');
        },
      },
    },
  ],
});
