<template>
  <v-content class="content-wrapper">
    <v-container class="masonry-container" :style="{ height: Boolean(page) ? 'auto' : '100%' }">
      <h1 class="text-center">
        My Musings & Other Thoughts
      </h1>
      <masonry :cols="{ default: 4, 1264: 3, 960: 2, 600: 1 }" :gutter="20">
        <ArticleCard v-for="article in articles" :key="article.id" :article="article" class="masonry-item" />
      </masonry>
      <div
        v-if="loading && !endOfList"
        class="d-flex w-100 justify-center loading-icon"
        :style="{ height: Boolean(page) ? 'auto' : '100%' }"
      >
        <v-icon x-large v-text="'fas fa-circle-notch fa-10x fa-spin'" />
      </div>
    </v-container>
  </v-content>
</template>

<script>
import ArticleCard from '@/components/ArticleCard.vue'
import debounce from 'lodash.debounce'
import axios from 'axios'

export default {
  name: 'Blog',
  components: { ArticleCard },
  data() {
    return {
      page: 1,
      count: 10,
      scrollingElem: null,
      loading: true,
      endOfList: false,
      articles: [],
    }
  },
  watch: {
    articles() {},
  },
  mounted() {
    this.getBlogPosts()
    this.scrollingElem = document.getElementsByTagName('body')[0]
    this.scrollingElem.onscroll = this.onScroll
  },
  beforeDestroy() {
    this.scrollingElem.onscroll = null
  },
  methods: {
    async getBlogPosts() {
      const {
        data: { data },
      } = await axios.get('/api/blogpost', {
        method: 'get',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        params: { page: this.page, count: this.count },
        baseURL: '/',
      })
      this.articles.push(...data)
    },
    onScroll({
      target: {
        scrollingElement: { scrollTop, clientHeight, scrollHeight },
      },
    }) {
      if (scrollTop + clientHeight >= scrollHeight) {
        if (!this.endOfList) {
          this.loading = true
          this.page++
          debounce(this.getBlogPosts, 500)()
        }
      }
    },
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
  overflow: auto;

  .masonry-container {
    overflow: hidden;
  }
}
</style>
