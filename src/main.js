import Vue from 'vue'
import VueMasonry from 'vue-masonry-css'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import router from './router'
import store from './store/store'
import vuetify from './plugins/vuetify'
import VueCompositionAPI from '@vue/composition-api'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuelidate)
Vue.config.productionTip = false
Vue.use(VueMasonry)
Vue.use(VueCompositionAPI)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
