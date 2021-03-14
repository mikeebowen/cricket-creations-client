import axios from 'axios'
import cloneDeep from 'lodash.clonedeep'
import store from '../store/store'
import router from '../router'

export default {
  namespaced: true,
  state: () => ({
    selectedPost: null,
    cachedPost: null,
    posts: [],
    total: 0,
    userId: 0,
    page: 1,
    count: 10,
  }),
  mutations: {
    GET_POSTS(state, { posts, total }) {
      state.posts = posts
      state.total = total
    },
    SELECT_POST(state, post) {
      state.selectedPost = post
      state.cachedPost = cloneDeep(post)
    },
  },
  actions: {
    getPosts: async ({ commit }, params) => {
      try {
        const ps = await axios.get('/api/blogpost', params)
        commit('GET_POSTS', { posts: ps?.data?.data, total: ps?.data?.meta?.total })
        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    updatePost: async ({ dispatch, state }, post) => {
      try {
        if (Date.now() >= store.state?.user?.user.expiration) {
          await store.dispatch('user/refresh', { id: store.state?.user?.user.id, refreshToken: store.state?.user?.user.refreshToken })
          if (!store.state?.user?.user) {
            return router.push('/login')
          }
        }

        if (post.id) {
          await axios.patch(`/api/blogpost/${post.id}`, post.patchData, {
            headers: {
              Authorization: 'Bearer ' + store.state?.user?.user?.token,
            },
          })
        } else {
          await axios.post('/api/blogpost', post.postData, {
            headers: {
              Authorization: 'Bearer ' + store.state?.user?.user?.token,
            },
          })
        }
        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    selectPost({ commit }, post) {
      commit('SELECT_POST', post)
    },
    async deletePost({ commit }, id) {
      if (Date.now() >= store.state?.user?.user.expiration) {
        await store.dispatch('user/refresh', { id: store.state?.user?.user.id, refreshToken: store.state?.user?.user.refreshToken })
        if (!store.state?.user?.user) {
          return router.push('/login')
        }
      }

      await axios.delete(`/api/blogpost/${id}`, {
        headers: {
          Authorization: 'Bearer ' + store.state?.user?.user?.token,
        },
      })
    },
  },
}
