<template>
  <v-app-bar app flat :color="isAdmin ? primaryColorAdmin : bodyBackgroundColor" absolute hide-on-scroll clipped-left>
    <v-btn text to="/">
      <v-img v-if="isAdmin" src="@/assets/images/grasshopper-white.png" max-height="50px" max-width="50px" to="/" />
      <v-img v-else src="@/assets/images/grasshopper-black.png" max-height="50px" max-width="50px" to="/" />
      <v-toolbar-title :class="{ admin__text: isAdmin }" class="title"> Cricket Creations </v-toolbar-title>
    </v-btn>
    <div class="flex-grow-1" />
    <v-toolbar-items>
      <v-btn :class="{ admin__text: isAdmin }" text to="/projects"> Projects </v-btn>
      <v-btn :class="{ admin__text: isAdmin }" text to="/blog"> Blog </v-btn>
      <v-btn v-for="page in pages" :key="page.id" :class="{ admin__text: isAdmin }" text :to="{ path: `/${encodeURI(page.heading)}` }">
        {{ page.heading }}
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import { ref } from '@vue/composition-api'
import scssVariables from '@/variables.scss'
import store from '../store/store'

export default {
  name: 'Header',
  data() {
    return {
      pages: [],
    }
  },
  beforeMount() {
    store.dispatch('page/getPages', this.$route.name).then(() => {
      this.pages = store.state.page.pages.filter(p => p.published)
    })
  },
  setup(props, context) {
    const primaryColorAdmin = ref(scssVariables.primaryColorAdmin)
    const bodyBackgroundColor = ref(scssVariables.bodyBackgroundColor)
    const isAdmin = ref(false)

    return { primaryColorAdmin, isAdmin, bodyBackgroundColor }
  },
}
</script>

<style lang="scss" scoped>
@import '@/variables.scss';

.title {
  font-family: 'Bevan', cursive !important;
  text-transform: initial;
}

.admin__text {
  color: $primary-color-text-admin;
}
</style>
