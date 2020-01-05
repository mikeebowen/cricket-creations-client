<template>
  <v-content class="content-wrapper">
      <v-container class="masonry-container" :style="{height: Boolean(page) ? 'auto' : '100%'}">
        <masonry :cols="{default: 4, 1264: 3, 960: 2, 600: 1}" :gutter="20">
          <ArticleCard v-for="article in articles" :key="article.id" :article="article" class="masonry-item" />
        </masonry>
        <div v-if="loading && !endOfList"
          class="d-flex w-100 justify-center loading-icon"
          :style="{height: Boolean(page) ? 'auto' : '100%'}"
        >
          <v-icon x-large v-text="'fas fa-circle-notch fa-10x fa-spin'" />
        </div>
      </v-container>
  </v-content>
</template>

<script>
import axios from 'axios';
// import {debounce} from 'lodash';
import BlogPost from '@/store/models/BlogPost';
import ArticleCard from '@/components/ArticleCard.vue';

export default {
  name: 'Blog',
  components: {ArticleCard},
  data() {
    return {
      // articles: [],
      page: 0,
      perPage: 20,
      scrollingElem: null,
      loading: true,
      endOfList: false,
    };
  },
  computed: {
    articles() {
      const blogPosts = BlogPost.all();
      return blogPosts;
    },
  },
  watch: {
    articles() {
      
    },
  },
  methods: {
    onScroll({target: {scrollingElement: {scrollTop, clientHeight, scrollHeight}}}) {
      if (scrollTop + clientHeight >= scrollHeight) {
        if (!this.endOfList) {
          this.loading = true;
          this.page++;
          // debounce(this.getArticles, 300)();
        }
      }
    },
    async getArticles() {
      const {data: {data}} = await axios.get('/api/articles', {
        params: {
          page: this.page,
          perPage: this.perPage,
        },
      });
      this.articles.push(...data);
      this.endOfList = !(data && data.length);
      this.loading = false;
    },
  },
  mounted() {
    BlogPost.fetch({params: {page: this.page, perPage: this.perPage}}); // TODO: make pagination work
    // this.getArticles();
    this.scrollingElem = document.getElementsByTagName('body')[0];
    this.scrollingElem.onscroll = this.onScroll;
  },
  beforeDestroy() {
    this.scrollingElem.onscroll = null;
  },
};
</script>

<style lang="scss" scoped>
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
