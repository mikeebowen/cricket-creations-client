<template>
  <v-container fluid>
    <v-row v-if="selectedBlogPost && selectedBlogPost.title">
      <v-col xl="6" lg="8" sm="10" offset-xl="3" offset-lg="2" offset-sm="1">
        <p class="text-h1">{{ selectedBlogPost.title }}</p>
        <p v-if="selectedBlogPost && selectedBlogPost.subtitle" class="text-subtitle-1">{{ selectedBlogPost.subtitle }}</p>
      </v-col>
    </v-row>
    <v-row v-if="selectedBlogPost && selectedBlogPost.image">
      <v-col xl="6" lg="8" sm="10" offset-xl="3" offset-lg="2" offset-sm="1">
        <v-img :src="selectedBlogPost.image" />
      </v-col>
    </v-row>
    <v-row>
      <v-col xl="6" lg="8" sm="10" offset-xl="3" offset-lg="2" offset-sm="1">
        <p class="text-right my-0">By: {{ selectedBlogPost.author }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col xl="6" lg="8" sm="10" offset-xl="3" offset-lg="2" offset-sm="1">
        <v-sheet class="blog-post-sheet" color="white" elevation="1" outlined tile v-html="selectedBlogPost && selectedBlogPost.content" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BlogPost from '@/models/BlogPost'
import store from '@/store/store'

export default {
  name: 'BlogPost',
  props: { id: { type: String, default: '' }, blogPost: { type: BlogPost, default: null } },
  data() {
    return {
      blogPostSlug: this.$route.params.slug,
    }
  },
  computed: {
    selectedBlogPost: () => store.state.blogPost.selectedPost,
  },
  async mounted() {
    if (this.$route.params.blogPost && this.$route.params.blogPost instanceof BlogPost) {
      store.dispatch('blogPost/selectPost', this.$route.params.blogPost)
    } else {
      const id = this.blogPostSlug.split('-')[0]
      await store.dispatch('blogPost/getPost', id)
    }
  },
}
</script>

<style lang="scss" scoped>
.blog-post-sheet {
  padding: 1rem;
  margin-bottom: 3rem;

  p {
    img {
      height: auto;
      width: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
