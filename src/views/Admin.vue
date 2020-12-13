<template>
  <v-container class="post-list d-flex flex-column">
    <v-row>
      <v-col offset="2" cols="10">
        <BlogPostList :posts="posts" />
      </v-col>
    </v-row>
    <v-pagination v-model="page" :length="posts.length" :total-visible="7" />
  </v-container>
</template>

<script>
import BlogPostList from '@/components/BlogPostList'
// import AdminMenu from '@/components/AdminMenu.vue'
import axios from 'axios'
import { ref, onMounted, watch } from '@vue/composition-api'
export default {
  name: 'Admin',
  components: { BlogPostList },
  setup() {
    const page = ref(1)
    const count = ref(10)
    const posts = ref([])
    const getBlogPosts = async () => {
      const ps = await axios.get('/api/blogpost', { params: { userId: 1, page: page.value, count: count.value } })
      posts.value.push(...ps?.data?.data)
    }

    watch(page, (cur, prev) => {
      console.log({ cur, prev })
    })

    onMounted(() => {
      getBlogPosts()
    })
    return { page, count, posts }
  },
}
</script>

<style lang="scss" scoped>
.post-list {
  height: 100%;
}
</style>
