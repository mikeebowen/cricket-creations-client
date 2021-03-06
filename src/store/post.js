import axios from 'axios'
import cloneDeep from 'lodash.clonedeep'

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
        if (post.id) {
          await axios.patch(`/api/blogpost/${post.id}`, post.patchData)
        } else {
          await axios.post('/api/blogpost', post.postData)
        }
        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    selectPost({ commit }, post) {
      commit('SELECT_POST', post)
    },
  },
}
