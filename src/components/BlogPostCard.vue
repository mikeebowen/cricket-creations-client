<template>
  <v-card class="d-inline-block ma-3">
    <router-link :to="{ name: 'blogPost', params: { slug: slug, blogPost } }">
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
    <v-card-title v-if="!isLoading && blogPost && blogPost.title" class="align-end fill-height">
      {{ blogPost.title }}
    </v-card-title>
    <v-card-subtitle>
      {{ blogPost.subtitle }}
    </v-card-subtitle>
    <v-card-text>
      <v-divider />
      <p class="text-subtitle-2 text-right mb-0">{{ lastUpdated }}</p>
      <v-chip-group column>
        <v-chip v-for="tag in blogPost.tags" :key="tag.id" class="text-uppercase" @click="loadTagPage(tag)">{{ tag.name }}</v-chip>
      </v-chip-group>
    </v-card-text>
    <v-card-text
      class="text--primary blogPost"
      v-html="blogPost && blogPost.content && `${blogPost.content.substring(0, Math.ceil(Math.random() * 200) + 50)}...`"
    />
    <v-card-actions>
      <v-btn text :to="{ name: 'blogPost', params: { slug: slug, blogPost } }"> Read more... </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import deburr from 'lodash.deburr'
import BlogPost from '@/models/BlogPost'
import router from '@/router'
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
    slug() {
      return deburr(`${this.blogPost.id}-${this.blogPost.title.replaceAll(' ', '-').replace(/[^a-zA-Z0-9-_]/g, '')}`).toLowerCase()
    },
    lastUpdated() {
      return DateTime.fromISO(this.blogPost.lastUpdated).toLocaleString(DateTime.DATE_FULL)
    },
  },
  methods: {
    loadTagPage(e) {
      router.push({ name: 'tagSearch', params: { tagName: e.name } })
    },
  },
}
</script>

<style lang="scss" scoped></style>
