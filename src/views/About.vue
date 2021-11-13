<template>
  <div class="about">
    <h1>{{ page.title }}</h1>
    <hr />
    <div v-html="page.content" />
  </div>
</template>

<script>
import store from '@/store/store'
export default {
  data() {
    return { page: null }
  },
  beforeMount() {
    for (const page of store.state.page.pages) {
      if (page.heading === this.$route.params.name) {
        this.page = page
      }
    }
  },
}
</script>
