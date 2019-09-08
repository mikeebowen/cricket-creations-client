<template>
  <v-content>
    <v-container class="masonry-container">
      <masonry :cols="{default: 4, 1264: 3, 960: 2, 600: 1}" :gutter="20">
        <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
      </masonry>
    </v-container>
  </v-content>
</template>

<script>
import axios from 'axios';
import ArticleCard from '@/components/ArticleCard.vue';

export default {
  name: 'Blog',
  components: {ArticleCard},
  data() {
    return {
      articles: [],
    };
  },
  async mounted() {
    const {data: {data}} = await axios.get('/api/articles');
    this.articles = data;
  },
};
</script>

<style lang="scss" scoped>
.masonry-container {
  max-width: 1264px;
}
</style>
