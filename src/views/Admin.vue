<template>
  <v-container class="admin-container">
    <v-tabs v-model="tab">
      <v-tab href="#tab-0">Posts</v-tab>
      <v-tab href="#tab-1">Pages</v-tab>
      <v-tab href="#tab-2">Account</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-0">
        <PostEditor />
      </v-tab-item>
      <v-tab-item value="tab-1">
        <PageEditor :pages="pages" :cached-pages="cachedPages" />
      </v-tab-item>
      <v-tab-item value="tab-2">
        <AccountEditor />
      </v-tab-item>
    </v-tabs-items>
    <ConfirmDialog ref="confirmDialog" activator-class="activator">
      <template v-slot:headline> The following items have unsaved changes </template>
      <v-list flat>
        <v-list-item-group>
          <v-list-item v-for="(uns, i) in unsaved" :key="i">
            {{ uns || 'Untitled' }}
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </ConfirmDialog>
  </v-container>
</template>

<script>
import { ref, computed } from '@vue/composition-api'
import { isEqual } from '@/utils/utils'
import store from '@/store/store'
import PostEditor from '@/components/PostEditor'
import PageEditor from '@/components/PageEditor'
import ConfirmDialog from '@/components/ConfirmDialog'
import AccountEditor from '@/components/AccountEditor'

export default {
  name: 'Admin',
  components: { PostEditor, PageEditor, ConfirmDialog, AccountEditor },
  async beforeRouteLeave(to, from, next) {
    const { pages, cachedPages, selectedPost, cachedPost, unsaved, $refs } = this
    pages.forEach((p, i) => {
      if (!isEqual(p, cachedPages[i])) {
        unsaved.push(p.title)
      }
    })
    if (!isEqual(selectedPost, cachedPost)) {
      unsaved.push(selectedPost.title)
    }
    if (unsaved.length) {
      const decision = await $refs.confirmDialog.open()
      return next(decision)
    }
    return next(true)
  },
  setup() {
    const tab = ref('tab-0')
    const pages = computed(() => store.state.page.pages)
    const cachedPages = computed(() => store.state.page.cachedPages)
    const selectedPost = computed(() => store.state.post.selectedPost)
    const cachedPost = computed(() => store.state.post.cachedPost)
    const unsaved = ref([])
    const confirmDialog = ref(null)

    return { tab, pages, cachedPages, selectedPost, cachedPost, unsaved, confirmDialog }
  },
}
</script>

<style lang="scss" scoped>
.admin-container {
  height: 100%;
}
</style>
