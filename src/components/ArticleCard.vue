<template>
  <v-card class="d-inline-block ma-3">
    <v-img
      :src="(article && article.image) || require('@/assets/logo.png')"
      min-height="100px"
      class="white--text"
      @load="isLoading = false"
    >
      <v-card-title v-if="!isLoading" class="align-end fill-height">
        {{ article && article.title }}
      </v-card-title>
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-icon v-text="'fas fa-circle-notch fa-spin'" />
        </v-row>
      </template>
    </v-img>
    <v-card-text>
      <p>{{ article && article.author && article.author.firstName }} {{ article && article.author && article.author.lastName }}</p>
    </v-card-text>
    <v-card-text
      class="text--primary article"
      v-html="article && article.content && article.content.replace('<p>', '').substring(0, Math.ceil(Math.random() * 200) + 300)"
    />
    <v-card-actions>
      <v-btn text>
        Read more...
      </v-btn>
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
}
</script>

<style lang="scss" scoped></style>
