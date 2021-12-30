<template>
  <v-card class="d-inline-block ma-3">
    <router-link :to="{ name: 'blogPost', params: { id: link, blogPost } }">
      <v-img :src="(blogPost && blogPost.image) || require('@/assets/logo.png')" min-height="100px" @load="isLoading = false">
        <template #placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-col>
              <v-icon v-text="'fas fa-circle-notch fa-spin'" />
            </v-col>
          </v-row>
        </template>
      </v-img>
    </router-link>
    <v-card-title v-if="!isLoading" class="align-end fill-height">
      <h3 v-if="blogPost && blogPost.title" class="grey--text text--darken-2">{{ blogPost.title }}</h3>
    </v-card-title>
    <v-card-text>
      <v-divider />
      <p class="text-subtitle-2 text-right mb-0">{{ lastUpdated }}</p>
      <v-chip-group column>
        <v-chip v-for="tag in blogPost.tags" :key="tag.id" class="text-uppercase">{{ tag.name }}</v-chip>
      </v-chip-group>
      <p>{{ blogPost && blogPost.author && blogPost.author.firstName }} {{ blogPost && blogPost.author && blogPost.author.lastName }}</p>
    </v-card-text>
    <v-card-text
      class="text--primary blogPost"
      v-html="blogPost && blogPost.content && blogPost.content.replace('<p>', '').substring(0, Math.ceil(Math.random() * 200) + 300)"
    />
    <v-card-actions>
      <v-btn text :to="{ name: 'blogPost', params: { id: link, blogPost } }"> Read more... </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
// import router from '@/router'
// import { ref } from '@vue/composition-api'
import deburr from 'lodash.deburr'
import BlogPost from '@/models/BlogPost'
import { DateTime } from 'luxon'

export default {
  name: 'BlogPostCard',
  props: {
    blogPost: { type: BlogPost, default: () => new BlogPost({}) },
  },
  data() {
    return {
      isLoading: true,
    }
  },
  computed: {
    link() {
      return deburr(`${this.blogPost.id}-${this.blogPost.title.replaceAll(' ', '-').replace(/[^a-zA-Z0-9-_]/g, '')}`)
    },
    lastUpdated() {
      return DateTime.fromISO(this.blogPost.lastUpdated).toLocaleString(DateTime.DATE_FULL)
    },
  },
  methods: {
    // readMore() {
    //   console.log('🚀 ~ file: BlogPostCard.vue ~ line 49 ~ readMore ~ this.blogPost', this.$route.query)
    //   router.push({
    //     name: 'blogPost',
    //     params: { id: `${this.blogPost.title.replaceAll(' ', '-')}-${this.blogPost.id}`, blogPost: this.blogPost },
    //   })
    // },
  },
  // setup(props) {
  //   const readMore = () => {
  //     console.log('🚀 ~ file: BlogPostCard.vue ~ line 47 ~ setup ~ props', props.blogPost)
  //     router.push({ name: 'blogPost', params: { id: props.blogPost.id, blogPost: props.blogPost } })
  //   }

  //   return { readMore }
  // },
}
</script>

<style lang="scss" scoped></style>
