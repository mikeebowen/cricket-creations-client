import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import post from './post'
import page from './page'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    post,
    page,
    user,
  },
  plugins: [createPersistedState()],
})
