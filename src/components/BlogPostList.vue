<template>
  <!-- <v-card max-width="600" class="mx-auto">
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
  </v-card> -->
  <v-list>
    <v-subheader>My Posts</v-subheader>
    <v-list-item-group v-model="selectedItem" color="primary">
      <v-list-item v-for="post in posts" :key="post.id" @click="emitPost">
        <v-list-item-icon>
          <v-icon v-text="'mdi-lead-pencil'" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="post.title" />
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
        emit('postSelected', props.posts[selectedItem.value])
      })
    }
    return { selectedItem, emitPost }
  },
  props: {
    posts: { type: Array, default: () => [] },
  },
}
</script>

<style lang="scss">
#app {
  background-color: white;
}
</style>
