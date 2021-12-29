import axios from 'axios'
import cloneDeep from 'lodash.clonedeep'
import store from './store'
import BlogPost from '../models/Post'
import { refreshCredentials } from '../utils/utils'

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
      state.posts = posts.map(p => new BlogPost(p))
      state.total = total
    },
    SELECT_POST(state, post) {
      state.selectedPost = post
      state.cachedPost = cloneDeep(post)
    },
    SET_CACHED_POST(state, post) {
      state.cachedPost = post
    },
  },
  actions: {
    getPosts: async ({ commit }, params) => {
      try {
        await refreshCredentials()

        const ps = await axios.get('/api/blogpost', {
          ...params,
          headers: {
            Authorization: 'Bearer ' + store.state?.user?.user?.token,
            'Content-Type': 'application/json',
            'Clear-Site-Data': '*',
          },
        })
        commit('GET_POSTS', { posts: ps?.data?.data, total: ps?.data?.meta?.total })
        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    updatePost: async ({ commit }, post) => {
      try {
        await refreshCredentials()

        if (post.id) {
          await axios.patch('/api/blogpost', post.patchData, {
            headers: {
              Authorization: 'Bearer ' + store.state?.user?.user?.token,
            },
          })
        } else {
          await axios.post('/api/blogpost', post.data, {
            headers: {
              Authorization: 'Bearer ' + store.state?.user?.user?.token,
            },
          })
        }

        commit('SET_CACHED_POST', post)

        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    selectPost({ commit }, post) {
      commit('SELECT_POST', post)
    },
    async deletePost({ commit }, id) {
      await refreshCredentials()

      await axios.delete(`/api/blogpost/${id}`, {
        headers: {
          Authorization: 'Bearer ' + store.state?.user?.user?.token,
        },
      })
    },
  },
}
