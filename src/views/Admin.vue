<template>
  <v-container class="admin-container">
    <v-tabs v-model="tab">
      <v-tab href="#tab-0">Posts</v-tab>
      <v-tab href="#tab-1">Pages</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-0">
        <PostEditor :selected-post="selectedPost" :cached-post="cachedPost" />
      </v-tab-item>
      <v-tab-item value="tab-1">
        <PageEditor :pages="pages" :cached-pages="cachedPages" />
      </v-tab-item>
    </v-tabs-items>
    <ConfirmDialog activator-class="activator" :dialog="dialog" @submit="handleConfirm">
      <template v-slot:headline>
        The following items have unsaved changes
      </template>
      <v-list flat>
        <v-list-item-group>
          <v-list-item v-for="(un, i) in unsaved" :key="i">
            {{ un || 'Untitled' }}
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </ConfirmDialog>
  </v-container>
</template>

<script>
import { ref } from '@vue/composition-api'
import { isEqual } from '@/utils/'
import PostEditor from '@/components/PostEditor'
import PageEditor from '@/components/PageEditor'
import ConfirmDialog from '@/components/ConfirmDialog'

export default {
  name: 'Admin',
  components: { PostEditor, PageEditor, ConfirmDialog },
  setup() {
    const tab = ref('tab-0')
    const pages = ref([])
    const cachedPages = ref([])
    const selectedPost = ref(null)
    const cachedPost = ref(null)
    const unsaved = ref([])
    const dialog = ref(false)
    const handleConfirm = e => {
      console.log('🚀 ~ file: Admin.vue ~ line 47 ~ setup ~ e', e)
    }
    return { tab, pages, cachedPages, selectedPost, cachedPost, unsaved, dialog, handleConfirm }
  },
  beforeRouteLeave(to, from, next) {
    const { pages, cachedPages, selectedPost, cachedPost, unsaved } = this
    pages.forEach((p, i) => {
      if (!isEqual(p, cachedPages[i])) {
        unsaved.push(p.title)
      }
    })
    if (!isEqual(selectedPost, cachedPost)) {
      unsaved.push(selectedPost.title)
    }
    this.dialog = true
    return false
  },
}
</script>

<style lang="scss" scoped>
.admin-container {
  height: 100%;
}
</style>
