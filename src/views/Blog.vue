<template>
  <v-container :key="$route.fullPath" class="masonry-container content-wrapper" :style="{ height: Boolean(page) ? 'auto' : '100%' }">
    <h1 class="text-center">{{ title }}</h1>
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
import router from '@/router'

export default {
  name: 'Blog',
  components: { BlogPostCard },
  props: { tagName: { type: String, default: '' } },
  watch: {
    $route(to, from) {
      this.page = 1
    },
  },
  beforeUpdate() {},
  setup(props) {
    const blogPosts = ref([])
    const total = ref(null)
    const page = ref(1)
    const count = ref(8)
    const title = ref('')

    const getBlogPosts = async () => {
      try {
        if (!loading.value || page.value === 1) {
          loading.value = true
          let res

          if (router.currentRoute.params.tagName) {
            title.value = router.currentRoute.params.tagName

            const data = await axios.get('/api/tag/blogposts', {
              params: {
                tagName: router.currentRoute.params.tagName,
                page: page.value,
                count: count.value,
              },
            })

            res = data.data
          } else if (router.currentRoute.name === 'projects') {
            title.value = 'Projects'

            const data = await axios.get('/api/tag/blogposts', {
              params: {
                tagName: 'projects',
                page: page.value,
                count: count.value,
              },
            })

            res = data.data
          } else {
            title.value = 'Musings & Other Thoughts'

            const data = await axios.get('/api/blogpost', {
              method: 'get',
              headers: { 'X-Requested-With': 'XMLHttpRequest' },
              params: { page: page.value, count: count.value },
              baseURL: '/',
            })

            res = data.data
          }

          total.value = res.meta.total

          if (total.value <= count.value * page.value) {
            endOfList.value = true
          }

          blogPosts.value.push(...res.data.map(p => new BlogPost(p)))

          count.value = 4
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
      document.body.addEventListener('scroll', onScroll)
      let hasVerticalScrollbar

      do {
        await getBlogPosts()
        hasVerticalScrollbar = document.body.scrollHeight > document.body.clientHeight
      } while (!hasVerticalScrollbar && total.value > count.value * page.value)
    })

    onBeforeUnmount(() => {
      document.body.removeEventListener('scroll', onScroll)
    })

    return { blogPosts, loading, endOfList, page, count, title }
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
