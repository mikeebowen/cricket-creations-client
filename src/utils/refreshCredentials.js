import store from '../store/store'
import router from '../router'

export default async function () {
  if (Date.now() >= store.state?.user?.user.expiration) {
    await store.dispatch('user/refresh', { id: store.state?.user?.user.id, refreshToken: store.state?.user?.user.refreshToken })
    if (!store.state?.user?.user) {
      return router.push('/login')
    }
  }
}
