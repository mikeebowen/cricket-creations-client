<template>
  <v-container class="masonry-container content-wrapper" :style="{ height: Boolean(page) ? 'auto' : '100%' }">
    <h1 class="text-center">My Musings & Other Thoughts</h1>
    <masonry :cols="{ default: 4, 1264: 3, 960: 2, 600: 1 }" :gutter="20">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
        class="masonry-item"
      />
    </masonry>
    <div v-if="loading && !endOfList" class="d-flex w-100 justify-center loading-icon" :style="{ height: Boolean(page) ? 'auto' : '100%' }">
      <v-icon x-large v-text="'fas fa-circle-notch fa-10x fa-spin'" />
    </div>
  </v-container>
</template>

<script>
import ArticleCard from '@/components/ArticleCard.vue'
import debounce from 'lodash.debounce'
import axios from 'axios'
import { ref, onMounted, onBeforeUnmount } from '@vue/composition-api'

export default {
  name: 'Blog',
  components: { ArticleCard },
  setup(props) {
    const articles = ref([])
    let page = ref(1)
    const count = ref(10)
    const getBlogPosts = async () => {
      const {
        data: { data },
      } = await axios.get('/api/blogpost', {
        method: 'get',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        params: { page, count },
        baseURL: '/',
      })
      articles.value.push(...data)
    }
    const scrollingElem = ref(null)
    const loading = ref(true)
    const endOfList = ref(false)
    const onScroll = ({
      target: {
        scrollingElement: { scrollTop, clientHeight, scrollHeight },
      },
    }) => {
      if (scrollTop + clientHeight >= scrollHeight) {
        if (!endOfList.value) {
          loading.value = true
          page++
          debounce(getBlogPosts, 500)()
        }
      }
    }
    onMounted(() => {
      getBlogPosts()
      scrollingElem.value = document.getElementsByTagName('body')[0]
      scrollingElem.value.onscroll = onScroll
    })
    onBeforeUnmount(() => {
      scrollingElem.value.onscroll = null
    })
    return { articles, loading, endOfList, page, count }
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
