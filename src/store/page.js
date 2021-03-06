import axios from 'axios'
import cloneDeep from 'lodash.clonedeep'
import Page from '../models/Page'
import store from '@/store/store'
import router from '../router'

export default {
  namespaced: true,
  state: () => ({
    pages: [],
    cachedPages: [],
  }),
  mutations: {
    GET_PAGES(state, pages) {
      state.pages = pages
      state.cachedPages = pages.map(p => cloneDeep(p))
    },
  },
  actions: {
    async getPages({ commit }) {
      try {
        const pgs = await axios.get('/api/page')
        commit('GET_PAGES', [
          ...pgs?.data?.data.map(p => new Page(p)),
          new Page({
            created: '',
            lastUpdated: '',
            title: '',
            content: '',
            heading: '',
          }),
        ])
        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async updatePage({ dispatch }, page) {
      try {
        if (Date.now() >= store.state?.user?.user.expiration) {
          await store.dispatch('user/refresh', { id: store.state?.user?.user.id, refreshToken: store.state?.user?.user.refreshToken })
          if (!store.state?.user?.user) {
            return router.push('/login')
          }
        }

        if (page.id) {
          await axios.patch(`/api/page/${page.id}`, page.patchData, {
            headers: {
              Authorization: 'Bearer ' + store.state?.user?.user?.token,
            },
          })
          dispatch('getPages')
        } else {
          await axios.post('/api/page', page.postData, {
            headers: {
              Authorization: 'Bearer ' + store.state?.user?.user?.token,
            },
          })
          dispatch('getPages')
        }
        Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async deletePage({ dispatch }, id) {
      try {
        if (id) {
          if (Date.now() >= store.state?.user?.user.expiration) {
            await store.dispatch('user/refresh', { id: store.state?.user?.user.id, refreshToken: store.state?.user?.user.refreshToken })
            if (!store.state?.user?.user) {
              return router.push('/login')
            }
          }

          await axios.delete(`/api/page/${id}`, {
            headers: {
              Authorization: 'Bearer ' + store.state?.user?.user?.token,
            },
          })
        }
        dispatch('getPages')
        Promise.resolve()
      } catch (err) {
        Promise.reject(err)
      }
    },
  },
}
