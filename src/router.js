import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL || 8080,
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        // route level code-splitting
        // this generates a separate chunk (home.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        default: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
        // header: null,
        footer: () => import('@/components/Footer.vue'),
      },
    },
    {
      path: '/blog',
      name: 'blog',
      components: {
        default: () => import(/* webpackChunkName: "blog" */ '@/views/Blog.vue'),
        header: () => import('@/components/Header.vue'),
      },
    },
    {
      path: '/blog/:slug',
      name: 'blogPost',
      props: true,
      components: {
        default: () => import(/* webpackChunkName: "blogPost" */ '@/views/BlogPost.vue'),
        header: () => import('@/components/Header.vue'),
        footer: () => import('@/components/Footer.vue'),
      },
    },
    {
      path: '/projects',
      name: 'projects',
      components: {
        default: () => import(/* webpackChunkName: "projects" */ '@/views/Blog.vue'),
        header: () => import('@/components/Header.vue'),
        footer: null,
      },
    },
    {
      path: '/tag/:tagName',
      name: 'tagSearch',
      components: {
        default: () => import(/* webpackChunkName: "tagSearch" */ '@/views/Blog.vue'),
        header: () => import('@/components/Header.vue'),
        footer: null,
      },
    },
    {
      path: '/admin',
      name: 'admin',
      components: {
        default: () => import(/* webpackChunkName: "admin" */ '@/views/Admin.vue'),
        header: () => import('@/components/Header.vue'),
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
        default: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
      },
      beforeEnter(to, from, next) {
        try {
          const user = store.state?.user?.user
          if (user) {
            next('/admin')
          } else {
            next()
          }
        } catch (err) {
          console.error(err.message || err)
        }
      },
    },
    {
      path: '/password-reset/:id',
      name: 'passwordReset',
      components: {
        header: () => import('@/components/Header.vue'),
        footer: null,
        default: () => import(/* webpackChunkName: "passwordReset" */ '@/views/ResetPassword.vue'),
      },
    },
    {
      path: '/password-reset',
      redirect: { name: 'login' },
    },
    {
      path: '/notfound',
      name: 'notfound',
      components: {
        default: () => import(/* webpackChunkName: "notfound" */ '@/views/FourOFour.vue'),
        header: () => import('@/components/Header.vue'),
        footer: () => import('@/components/Footer.vue'),
      },
    },
    {
      path: '/:heading',
      components: {
        default: () => import(/* webpackChunkName: "page" */ '@/views/Page.vue'),
        header: () => import('@/components/Header.vue'),
        footer: () => import('@/components/Footer.vue'),
      },
    },
  ],
})

router.afterEach((to, from) => {
  // eslint-disable-next-line no-undef
  gtag('set', 'page_path', to.path)
  // eslint-disable-next-line no-undef
  gtag('set', 'page_title', to.name)
  // eslint-disable-next-line no-undef
  gtag('set', 'page_location', location.href)
  // eslint-disable-next-line no-undef
  gtag('event', 'page_view')
})

export default router
