import axios from 'axios'
import cloneDeep from 'lodash.clonedeep'
import store from './store'
import router from '../router'
import Page from '../models/Page'

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
    ADD_PAGE(state) {
      state.pages.push(
        new Page({
          created: '',
          lastUpdated: '',
          title: '',
          content: '',
          heading: '',
        }),
      )
      state.cachedPages = state.pages.map(p => cloneDeep(p))
    },
  },
  actions: {
    async getPages({ commit }, routeName) {
      try {
        const pgs = await axios.get('/api/page')
        const pages = pgs?.data?.data.map(p => new Page(p))
        commit('GET_PAGES', pages)
        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async updatePage({ dispatch, state }, page) {
      try {
        if (Date.now() >= store.state?.user?.user.expiration) {
          await dispatch(
            'user/refresh',
            { id: store.state?.user?.user.id, refreshToken: store.state?.user?.user.refreshToken },
            { root: true },
          )
          if (!store.state?.user?.user) {
            return router.push('/login')
          }
        }

        if (page.id) {
          await axios.patch('/api/page', page.data, {
            headers: {
              Authorization: 'Bearer ' + store.state?.user?.user?.token,
            },
          })
          dispatch('getPages')
        } else {
          await axios.post('/api/page', page.data, {
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
    addPage({ commit }) {
      commit('ADD_PAGE')
    },
    async deletePage({ dispatch }, id) {
      try {
        if (id) {
          if (Date.now() >= store.state?.user?.user.expiration) {
            await store.dispatch(
              'user/refresh',
              { id: store.state?.user?.user.id, refreshToken: store.state?.user?.user.refreshToken },
              { root: true },
            )
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
