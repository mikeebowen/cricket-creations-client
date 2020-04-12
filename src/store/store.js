import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import VuexORMAxios from '@vuex-orm/plugin-axios'
import axios from 'axios'
import User from './models/User'
import BlogPost from './models/BlogPost'

Vue.use(Vuex)
VuexORM.use(VuexORMAxios, {axios})
const database = new VuexORM.Database()
database.register(User)
database.register(BlogPost)

export default new Vuex.Store({
  plugins: [VuexORM.install(database)],
  state: {

  },
  mutations: {

  },
  actions: {

  },
})
