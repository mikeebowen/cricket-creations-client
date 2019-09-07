<template>
  <v-container>
    <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
  </v-container>
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
    // debugger;
    this.articles = data;
  },
};
</script>

<style lang="scss" scoped>

</style>
