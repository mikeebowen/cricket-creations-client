import axios from 'axios'
import cloneDeep from 'lodash.clonedeep'
import store from './store'
import BlogPost from '../models/BlogPost'
import { refreshCredentials } from '../utils/utils'

export default {
  namespaced: true,
  state: () => ({
    selectedPost: null,
    cachedPost: null,
    blogPosts: [],
    total: 0,
    userId: 0,
    page: 1,
    count: 10,
  }),
  mutations: {
    GET_POSTS(state, { blogPosts, total }) {
      state.blogPosts = blogPosts.map(p => new BlogPost(p))
      state.total = total
    },
    SELECT_POST(state, blogPost) {
      state.selectedPost = blogPost instanceof BlogPost ? blogPost : new BlogPost(blogPost)
      state.cachedPost = cloneDeep(blogPost)
    },
    SET_CACHED_POST(state, blogPost) {
      state.cachedPost = blogPost
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
        commit('GET_POSTS', { blogPosts: ps?.data?.data, total: ps?.data?.meta?.total })
        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async getPost({ commit }, blogPostId) {
      try {
        const bpId = parseInt(blogPostId)

        if (isNaN(bpId)) {
          return Promise.reject(new Error('Invalid blog post id'))
        }

        const res = await axios.get(`/api/blogpost/${blogPostId}`)

        commit('SELECT_POST', res.data.data)
        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    updatePost: async ({ commit }, blogPost) => {
      try {
        await refreshCredentials()

        if (blogPost.id) {
          await axios.patch('/api/blogpost', blogPost.patchData, {
            headers: {
              Authorization: 'Bearer ' + store.state?.user?.user?.token,
            },
          })
        } else {
          await axios.post('/api/blogpost', blogPost.data, {
            headers: {
              Authorization: 'Bearer ' + store.state?.user?.user?.token,
            },
          })
        }

        commit('SET_CACHED_POST', blogPost)

        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    selectPost({ commit }, blogPost) {
      commit('SELECT_POST', blogPost)
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
