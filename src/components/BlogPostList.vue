<template>
  <v-card max-width="600" class="mx-auto">
    <v-toolbar color="light-blue" dark>
      <v-toolbar-title>My Posts</v-toolbar-title>
      <v-list subheader two-line>
        <v-list-item v-for="post in posts" :key="post.id">
          <v-list-item-avatar>
            <v-icon class="blue" dark v-text="'mdi-clipboard-text'" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="post.title" />

            <v-list-item-subtitle v-text="post.lastUpdated" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
  name: 'BlogPostList',
  props: {
    posts: { type: Array, default: () => [] },
  },
}
</script>

<style lang="scss" scoped></style>
