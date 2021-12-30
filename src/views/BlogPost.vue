<template>
  <v-container>
    <p>{{ blogPostId }}</p>
    <p>{{ selectedBlogPost }}</p>
    <v-sheet color="white" elevation="1" outlined tile v-html="selectedBlogPost && selectedBlogPost.content" />
  </v-container>
</template>

<script>
import BlogPost from '@/models/BlogPost'

export default {
  name: 'BlogPost',
  props: { id: { type: String, default: '' }, blogPost: { type: BlogPost, default: null } },
  data() {
    return {
      blogPostId: this.$route.params.id,
      selectedBlogPost: this.$route.params.blogPost,
    }
  },
  mounted() {
    console.log({ blogPostId: this.blogPostId, selectedBlogPost: this.selectedBlogPost })
  },
}
</script>

<style lang="scss" scoped></style>
