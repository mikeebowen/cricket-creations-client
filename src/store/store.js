import Vue from 'vue'
import Vuex from 'vuex'
import post from './post'
import page from './page'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    post,
    page,
  },
})
