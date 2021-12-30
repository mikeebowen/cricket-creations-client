import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import blogPost from './blogPost'
import page from './page'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    blogPost,
    page,
    user,
  },
  plugins: [createPersistedState()],
})
