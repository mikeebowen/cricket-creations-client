import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL || 8080,
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: () => import('@/views/Home.vue'),
        // header: null,
        footer: () => import('@/components/Footer.vue'),
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
        header: () => import('@/components/Header.vue'),
        footer: () => import('@/components/Footer.vue'),
      },
    },
    {
      path: '/projects',
      name: 'projects',
      components: {
        default: () => import('@/views/Projects.vue'),
        header: () => import('@/components/Header.vue'),
        footer: () => import('@/components/Footer.vue'),
      },
    },
    {
      path: '/musings',
      name: 'musings',
      components: {
        default: () => import('@/views/Blog.vue'),
        header: () => import('@/components/Header.vue'),
      },
    },
    {
      path: '/admin',
      name: 'admin',
      components: {
        default: () => import('@/views/Admin.vue'),
        header: () => import('@/components/Header.vue'),
        adminHeader: () => import('@/components/AdminMenu.vue'),
        footer: null,
      },
      beforeEnter: async (to, from, next) => {
        const user = store.state?.user?.user
        if (!user) {
          return next('/login')
        }
        try {
          if (Date.now() >= user.expiration) {
            await store.dispatch('user/refresh', { id: user.id, refreshToken: user.refreshToken })
            if (!user) {
              return next('/login')
            }
            return next()
          }
          return next()
        } catch (err) {
          console.error(err.message || err)
          return next('/login')
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      components: {
        header: () => import('@/components/Header.vue'),
        footer: null,
        default: () => import('@/views/Login.vue'),
      },
      beforeEnter(to, from, next) {
        const user = store.state?.user?.user
        if (user) {
          next('/admin')
        } else {
          next()
        }
      },
    },
  ],
})
