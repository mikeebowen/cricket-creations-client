<template>
  <v-container>
    <BlogPostList :posts="articles" />
  </v-container>
</template>

<script>
import BlogPostList from '@/components/BlogPostList'
export default {
  name: 'Admin',
  components: { BlogPostList },
  computed: {
    articles() {
      return []
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped></style>
