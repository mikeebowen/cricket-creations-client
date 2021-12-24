import axios from 'axios'
import jwtDecode from 'jwt-decode'
import User from '../models/User'
import store from './store'
import router from '../router'

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
    async saveUser({ commit, dispatch }, userInfo) {
      try {
        if (Date.now() >= store.state?.user?.user.expiration) {
          await dispatch('user/refresh', { id: store.state?.user?.user.id, refreshToken: store.state?.user?.user.refreshToken })
          if (!store.state?.user?.user) {
            return router.push('/login')
          }
        }

        const user = getDatabaseUser(userInfo)
        await axios.patch('/api/user', user, {
          headers: {
            Authorization: 'Bearer ' + store.state?.user?.user?.token,
            'Content-Type': 'application/json',
            'Clear-Site-Data': '*',
          },
        })

        commit('SET_USER', userInfo)
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async register({ commit }, userInfo) {
      try {
        const newUser = getDatabaseUser(userInfo)
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
    async updatePassword({ commit }, password) {
      try {
        await axios.post(
          '/api/user/password',
          { password },
          {
            headers: {
              Authorization: 'Bearer ' + store.state?.user?.user?.token,
              'Content-Type': 'application/json',
              'Clear-Site-Data': '*',
            },
          },
        )
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
    logout: async ({ commit }) => {
      try {
        await axios.delete('/api/user/logout', {
          headers: {
            Authorization: 'Bearer ' + store.state?.user?.user?.token,
            'Content-Type': 'application/json',
            'Clear-Site-Data': '*',
          },
        })

        commit('SET_USER', null)
      } catch (err) {
        return Promise.reject(err)
      }
    },
  },
}

function getUser(res) {
  const {
    data: { token, refreshToken, avatar },
  } = res
  const user = {}
  const { nameid, given_name, unique_name, family_name, email, exp } = jwtDecode(token)
  user.id = nameid
  user.name = given_name
  user.userName = unique_name
  user.surname = family_name
  user.email = email
  user.avatar = avatar ? avatar : require('@/assets/images/abstract-user-flat-4.svg')
  user.token = token
  user.refreshToken = refreshToken
  user.expiration = exp * 1000
  return new User(user)
}

function getDatabaseUser(user) {
  const newUser = {}
  newUser.Name = user.name
  newUser.Surname = user.surname
  newUser.Email = user.email
  newUser.UserName = user.userName
  newUser.Password = user.password
  newUser.Avatar = user.avatar

  return newUser
}
