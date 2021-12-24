<template>
  <v-container class="admin-container">
    <v-toolbar flat>
      <v-tabs v-model="tab" @change="checkPages">
        <v-tab href="#tab-0">Posts</v-tab>
        <v-tab href="#tab-1">Pages</v-tab>
        <v-tab href="#tab-2" class="d-none">Account</v-tab>
      </v-tabs>
      <v-spacer />
      <v-menu bottom left offset-x offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab dark small v-bind="attrs" v-on="on">
            <v-avatar>
              <img :src="user && user.avatar" :alt="`${user && user.name} ${user && user.surname}`" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item-group>
            <v-list-item @click="goToTab('tab-2')">
              <v-list-item-icon>
                <v-icon>mdi-account-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-title>My Account</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-0">
        <PostEditor />
      </v-tab-item>
      <v-tab-item value="tab-1">
        <PageEditor ref="pageEditor" :pages="pages" :cached-pages="cachedPages" />
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
    <ConfirmDialog ref="logoutDialog" activator-class="activator">
      <template v-slot:headline>You are attempting to log out.</template>
      Are you sure?
    </ConfirmDialog>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
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
import router from '@/router'

export default {
  name: 'Admin',
  components: { PostEditor, PageEditor, ConfirmDialog, AccountEditor },
  methods: {
    async checkPages() {
      const { $refs } = this
      if ($refs.pageEditor) {
        await $refs.pageEditor.checkPages()
      }
    },
  },
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
    const logoutDialog = ref(null)
    const overlay = ref(false)
    const user = computed(() => store.state.user.user)

    const logout = async () => {
      const lg = await logoutDialog.value.open()
      if (lg) {
        overlay.value = true
        await store.dispatch('user/logout')
        router.push('login')
        overlay.value = false
      }
    }

    const goToTab = tabId => {
      tab.value = tabId
    }

    return {
      tab,
      pages,
      cachedPages,
      selectedPost,
      cachedPost,
      unsaved,
      confirmDialog,
      logout,
      overlay,
      logoutDialog,
      user,
      goToTab,
    }
  },
}
</script>

<style lang="scss" scoped>
.admin-container {
  height: 100%;
}
</style>
