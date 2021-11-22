<template>
  <v-card class="d-inline-block ma-3">
    <v-img :src="(article && article.image) || require('@/assets/logo.png')" min-height="100px" @load="isLoading = false">
      <v-card-title v-if="!isLoading" class="align-end fill-height">
        <h3 v-if="article && article.title" class="grey--text text--darken-2">{{ article.title }}</h3>
      </v-card-title>
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-col>
            <v-icon v-text="'fas fa-circle-notch fa-spin'" />
          </v-col>
        </v-row>
      </template>
    </v-img>
    <v-card-text>
      <v-divider />
      <v-chip-group>
        <v-chip v-for="tag in article.tags" :key="tag.id" class="text-uppercase">{{ tag.name }}</v-chip>
      </v-chip-group>
      <p>{{ article && article.author && article.author.firstName }} {{ article && article.author && article.author.lastName }}</p>
    </v-card-text>
    <v-card-text
      class="text--primary article"
      v-html="article && article.content && article.content.replace('<p>', '').substring(0, Math.ceil(Math.random() * 200) + 300)"
    />
    <v-card-actions @click="loadBlogPost">
      <v-btn text> Read more... </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ArticleCard',
  props: {
    article: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      isLoading: true,
    }
  },
  methods: {
    loadBlogPost() {
      console.log(this.article)
    },
  },
}
</script>

<style lang="scss" scoped></style>
