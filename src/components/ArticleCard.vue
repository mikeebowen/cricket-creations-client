<template>
  <v-card>
      <slot>
        <v-img :src="article && article.image" class="white--text">
          <v-card-title class="align-end fill-height">{{article && article.title}}</v-card-title>
        </v-img>
        <v-card-text>
          <p>{{article && article.author && article.author.firstName}} {{article && article.author && article.author.lastName}}</p>
        </v-card-text>
        <v-card-text class="text--primary article" v-html="article && article.shortText">
        </v-card-text>
        <v-card-actions>
          <v-btn text>Read more...</v-btn>
        </v-card-actions>
      </slot>
  </v-card>
</template>

<script>
export default {
  name: 'ArticleCard',
  props: {
    article: Object,
  },
};
</script>

<style lang="scss" scoped>

</style>
