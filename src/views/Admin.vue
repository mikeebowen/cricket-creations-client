<template>
  <v-container class="admin-container">
    <v-tabs v-model="tab">
      <v-tab href="#tab-0">Posts</v-tab>
      <v-tab href="#tab-1">Pages</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-0">
        <PostEditor />
      </v-tab-item>
      <v-tab-item value="tab-1">
        <PageEditor />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { ref } from '@vue/composition-api'
import PostEditor from '@/components/PostEditor'
import PageEditor from '@/components/PageEditor'
export default {
  name: 'Admin',
  components: { PostEditor, PageEditor },
  setup() {
    const tab = ref('tab-0')
    return { tab }
  },
}
</script>

<style lang="scss" scoped>
.admin-container {
  height: 100%;
}
</style>
