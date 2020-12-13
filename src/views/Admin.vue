<template>
  <v-container class="post-list d-flex flex-column">
    <v-row>
      <v-col offset="2" cols="10">
        <BlogPostList :posts="posts" />
      </v-col>
    </v-row>
    <v-pagination v-model="page" :length="total" :total-visible="9" />
  </v-container>
</template>

<script>
import BlogPostList from '@/components/BlogPostList'
// import AdminMenu from '@/components/AdminMenu.vue'
import axios from 'axios'
import { ref, onMounted, watch, computed } from '@vue/composition-api'
export default {
  name: 'Admin',
  components: { BlogPostList },
  setup() {
    const page = ref(1)
    const count = ref(10)
    const posts = ref([])
    const t = ref(0)
    const error = ref('')
    const total = computed(() => parseInt(t.value / count.value + 1))
    const getBlogPosts = async () => {
      const ps = await axios.get('/api/blogpost', { params: { userId: 1, page: page.value, count: count.value } })
      posts.value.length = 0
      t.value = ps?.data?.meta?.total
      posts.value.push(...ps?.data?.data)
    }

    watch(page, (cur, prev) => {
      getBlogPosts()
    })

    onMounted(() => {
      getBlogPosts()
    })
    return { page, count, posts, total, error }
  },
}
</script>

<style lang="scss" scoped>
.post-list {
  height: 100%;
}
</style>
