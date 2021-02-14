import axios from 'axios'
import cloneDeep from 'lodash.clonedeep'
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
        if (page.id) {
          await axios.patch(`/api/page/${page.id}`, page.patchData)
          dispatch('getPages')
        } else {
          await axios.post('/api/page', page.postData)
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
          await axios.delete(`/api/page/${id}`)
        }
        dispatch('getPages')
        Promise.resolve()
      } catch (err) {
        Promise.reject(err)
      }
    },
  },
}
