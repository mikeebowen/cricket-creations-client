<template>
  <v-container class="d-flex flex-column page container">
    <v-row class="flex-grow-0">
      <v-col>
        <h1 class="text-center">{{ page.title }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex flex-column">
        <v-sheet elevation="2" class="flex-grow-1 pa-12" v-html="page.content" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from '@/store/store'
export default {
  data() {
    return { page: null }
  },
  watch: {
    $route(to, from) {
      this.getPage()
    },
  },
  beforeMount() {
    this.getPage()
  },
  methods: {
    getPage() {
      let included = false
      for (const page of store.state.page.pages) {
        if (page.heading === this.$route.params.heading) {
          this.page = page
          included = true
        }
      }

      if (!included) {
        // TODO: navigate to 404 here
        this.page = null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
}

.container {
  max-width: 1000px;
}
</style>
