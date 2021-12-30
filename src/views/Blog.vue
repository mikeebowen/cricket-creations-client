<template>
  <v-container class="masonry-container content-wrapper" :style="{ height: Boolean(page) ? 'auto' : '100%' }">
    <h1 class="text-center">My Musings & Other Thoughts</h1>
    <masonry :cols="{ default: 4, 1264: 3, 960: 2, 600: 1 }" :gutter="20">
      <BlogPostCard v-for="blogPost in blogPosts" :key="blogPost.id" :blog-post="blogPost" class="masonry-item" />
    </masonry>
    <div v-if="loading && !endOfList" class="d-flex w-100 justify-center loading-icon" :style="{ height: Boolean(page) ? 'auto' : '100%' }">
      <v-icon x-large v-text="'fas fa-circle-notch fa-10x fa-spin'" />
    </div>
  </v-container>
</template>

<script>
import BlogPostCard from '@/components/BlogPostCard.vue'
import axios from 'axios'
import { ref, onMounted, onBeforeUnmount } from '@vue/composition-api'
import BlogPost from '@/models/BlogPost'

export default {
  name: 'Blog',
  components: { BlogPostCard },
  setup(props) {
    const blogPosts = ref([])
    const total = ref(null)
    const page = ref(1)
    const count = ref(4)

    const getBlogPosts = async () => {
      try {
        if (!loading.value || page.value === 1) {
          loading.value = true

          const { data: res } = await axios.get('/api/blogpost', {
            method: 'get',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            params: { page: page.value, count: count.value },
            baseURL: '/',
          })

          total.value = res.meta.total

          if (total.value <= count.value * page.value) {
            endOfList.value = true
          }

          blogPosts.value.push(...res.data.map(p => new BlogPost(p)))

          page.value++
          loading.value = false
        }
      } catch (err) {
        console.error(err.message || err)
      }
    }

    const loading = ref(true)
    const endOfList = ref(false)

    const onScroll = async e => {
      e.preventDefault()

      const { target } = e
      if (target?.scrollTop + target?.clientHeight >= target?.scrollHeight) {
        if (!endOfList.value) {
          await getBlogPosts()
        }
      }
    }

    onMounted(async () => {
      await getBlogPosts()
      document.body.addEventListener('scroll', onScroll)

      let hasVerticalScrollbar = document.body.scrollHeight > document.body.clientHeight

      while (!hasVerticalScrollbar && total.value > count.value * page.value) {
        await getBlogPosts()
        hasVerticalScrollbar = document.body.scrollHeight > document.body.clientHeight
      }
    })

    onBeforeUnmount(() => {
      document.body.removeEventListener('scroll', onScroll)
    })

    return { blogPosts, loading, endOfList, page, count }
  },
}
</script>

<style lang="scss" scoped>
h1 {
  font-family: 'Bevan', cursive;
  font-size: 3.8rem;
}
.masonry-container {
  max-width: 1264px;
}

.content-wrapper {
  overflow: visible;

  .masonry-container {
    overflow: hidden;
  }
}
</style>
