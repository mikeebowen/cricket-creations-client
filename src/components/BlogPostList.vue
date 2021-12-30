<template>
  <v-list>
    <v-subheader>My Posts</v-subheader>
    <v-list-item-group v-model="selectedItem" color="primary">
      <v-list-item v-for="blogPost in blogPosts" :key="blogPost.id" @click="emitPost">
        <v-list-item-icon>
          <v-icon v-text="'mdi-lead-pencil'" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="blogPost.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { ref } from '@vue/composition-api'
export default {
  name: 'BlogPostList',
  setup(props, { emit }) {
    const selectedItem = ref(null)
    const emitPost = () => {
      setTimeout(() => {
        emit('blogPost-selected', props.blogPosts[selectedItem.value])
      })
    }
    return { selectedItem, emitPost }
  },
  props: {
    blogPosts: { type: Array, default: () => [] },
  },
}
</script>

<style lang="scss">
#app {
  background-color: white;
}
</style>
