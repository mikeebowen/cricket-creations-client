import axios from 'axios'
import jwtDecode from 'jwt-decode'
import User from '../models/User'

export default {
  namespaced: true,
  state: {
    user: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
  },
  actions: {
    login: async ({ commit }, loginInfo) => {
      try {
        const res = await axios.post('/api/user/authenticate', loginInfo)
        if (res) {
          const user = getUser(res)
          commit('SET_USER', user)
        } else {
          commit('SET_USER', null)
        }
        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async register({ commit }, userInfo) {
      try {
        const newUser = getNewUser(userInfo)
        const res = await axios.post('/api/user/', newUser)
        if (res) {
          const user = getUser(res)
          commit('SET_USER', user)
        } else {
          commit('SET_USER', null)
        }
      } catch (err) {
        return Promise.reject(err)
      }
    },
    refresh: async ({ commit, state }) => {
      try {
        const res = await axios.post('/api/user/refresh', { id: state.user.id, refreshToken: state.user.refreshToken })
        if (res && res.status === 200) {
          const user = getUser(res)
          commit('SET_USER', user)
        } else {
          commit('SET_USER', null)
        }
        return Promise.resolve()
      } catch (err) {
        commit('SET_USER', null)
        return Promise.reject(err)
      }
    },
    logout: ({ commit }) => {
      commit('SET_USER', null)
    },
  },
}

function getUser(res) {
  const {
    data: { token, refreshToken },
  } = res
  const user = {}
  const { nameid, given_name, unique_name, family_name, email, avatar, exp } = jwtDecode(res.data.token)
  user.id = nameid
  user.name = given_name
  user.userName = unique_name
  user.surname = family_name
  user.email = email
  user.avatar = avatar
  user.token = token
  user.refreshToken = refreshToken
  user.expiration = exp * 1000
  return new User(user)
}

function getNewUser(user) {
  const newUser = {}
  newUser.Name = user.firstName
  newUser.Surname = user.lastName
  newUser.Email = user.email
  newUser.UserName = user.userName
  newUser.Password = user.password

  return newUser
}
