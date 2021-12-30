<template>
  <span v-if="showEditor" class="blogPost-list d-flex flex-column">
    <v-row class="my-2">
      <v-col xl="6" lg="8" sm="10" offset-xl="3" offset-lg="2" offset-sm="1">
        <v-btn-toggle>
          <v-btn tile @click="updatePost">Save</v-btn>
          <v-btn tile @click="saveAndClose">Save & Close</v-btn>
          <v-btn tile @click="close(true)">Close Without Saving</v-btn>
          <v-btn class="activator" tile @click="deletePost">Delete</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="3" offset-sm="1" offset-lg="2" offset-xl="3">
        <v-subheader> Created: {{ createdDate }} </v-subheader>
      </v-col>
      <v-col sm="3">
        <v-subheader> Last Updated: {{ lastUpdated }} </v-subheader>
      </v-col>
    </v-row>
    <v-skeleton-loader v-if="loading" class="mx-auto my-auto" :type="`list-item@${count}`" />
    <v-row v-else>
      <v-col sm="8" lg="6" xl="4" offset-sm="1" offset-lg="2" offset-xl="3">
        <TagEditor :tags="selectedPost.tags" @new-tags="updateTags" />
      </v-col>
      <v-col sm="2" class="d-flex justify-end">
        <v-switch v-model="selectedPost.published" inset label="published" />
      </v-col>
    </v-row>
    <v-row>
      <v-col xl="6" lg="8" sm="10" offset-xl="3" offset-lg="2" offset-sm="1">
        <v-text-field v-model="selectedPost.title" label="Title" />
      </v-col>
    </v-row>
    <v-row>
      <v-col xl="6" lg="8" sm="10" offset-xl="3" offset-lg="2" offset-sm="1">
        <v-img :src="selectedPost.image">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5" />
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-col xl="6" lg="8" sm="10" offset-xl="3" offset-lg="2" offset-sm="1">
        <v-file-input v-model="file" label="Select Cover Image" prepend-icon="mdi-camera" accept="image/*" @change="onFilePicked" />
      </v-col>
    </v-row>
    <v-row>
      <v-col xl="6" lg="8" sm="10" offset-xl="3" offset-lg="2" offset-sm="1">
        <Editor v-model="selectedPost.content" :init="editorConfig" />
      </v-col>
    </v-row>
    <ConfirmDialog ref="dialog" :headline="headline" :message="message" activator-class="activator" />
  </span>
  <v-skeleton-loader v-else-if="loading" class="mx-auto my-10" type="article, paragraph, paragraph, paragraph, paragraph" />
  <span v-else class="blogPost-list">
    <v-row>
      <v-col cols="10">
        <v-skeleton-loader v-if="loading" class="mx-auto" :type="`list-item@${count}`" />
        <BlogPostList v-else :blog-posts="blogPosts" @blogPost-selected="selectPost" />
      </v-col>
      <v-col cols="1">
        <v-btn color="gray" depressed outlined class="grey--text text--darken-3" @click="createPost"> New </v-btn>
      </v-col>
    </v-row>
    <v-pagination v-model="page" :length="total" :total-visible="9" class="pagination" />
    <v-snackbar v-model="snackbar" text color="red">
      <p>Something went wrong, your post couldn't save.</p>
      <v-icon color="red">mdi-alert</v-icon>
      {{ errors }}
    </v-snackbar>
  </span>
</template>

<script>
import BlogPostList from '@/components/BlogPostList'
import TagEditor from '@/components/TagEditor'
import ConfirmDialog from '@/components/ConfirmDialog'
import Editor from '@tinymce/tinymce-vue'
import BlogPost from '@/models/BlogPost'
import store from '@/store/store'
import 'tinymce/themes/silver'
import 'tinymce/plugins/table'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/spellchecker'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/save'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/code'
import { DateTime } from 'luxon'
import isEqual from 'lodash.isequal'
import { ref, onMounted, watch, computed } from '@vue/composition-api'
import { defaultEditorConfig, refreshCredentials } from '@/utils/utils'
import axios from 'axios'

export default {
  name: 'Admin',
  components: { BlogPostList, Editor, TagEditor, ConfirmDialog },
  setup() {
    const page = ref(1)
    const count = ref(10)
    const blogPosts = computed(() => store.state.blogPost.blogPosts)
    const t = computed(() => store.state.blogPost.total)
    const error = ref('')
    const total = computed(() => Math.max(parseInt(t.value / count.value + 1)))
    const loading = ref(true)
    const dialog = ref(null)
    const headline = ref('')
    const message = ref('')
    const errors = ref(null)
    const snackbar = ref(false)
    const selectedPost = computed(() => store.state.blogPost.selectedPost)
    const cachedPost = computed(() => store.state.blogPost.cachedPost)
    const showEditor = ref(false)
    const file = ref(null)

    const selectPost = blogPost => {
      store.dispatch('blogPost/selectPost', new BlogPost(blogPost))
      showEditor.value = true
    }
    const createPost = () => {
      store.dispatch('blogPost/selectPost', new BlogPost({}))
      showEditor.value = true
    }
    const updatePost = async () => {
      try {
        loading.value = true
        showEditor.value = false

        const location = await saveFile()

        selectedPost.value.image = location

        await store.dispatch('blogPost/updatePost', selectedPost.value)
        await getBlogPosts()

        page.value = 1
        loading.value = false
        showEditor.value = true
      } catch (err) {
        errors.value = err.message || err
        loading.value = false
        snackbar.value = true
      }
    }
    const close = async checkEqual => {
      if (checkEqual && !isEqual(selectedPost.value, cachedPost.value)) {
        headline.value = `There are unsaved changes to "${selectedPost.value && selectedPost.value.title}".`
        message.value = 'This cannot be undone.'

        const confirm = await dialog.value.open()

        if (confirm) {
          showEditor.value = false
          store.dispatch('blogPost/selectPost', null)
        }
      } else {
        showEditor.value = false
        store.dispatch('blogPost/selectPost', null)
      }
    }
    const saveAndClose = async () => {
      showEditor.value = false
      await updatePost()
      close(false)
    }
    const deletePost = async () => {
      const { id } = selectedPost.value
      headline.value = `Are you sure you want to delete "${selectedPost.value && selectedPost.value.title}"?`
      message.value = 'This will be really annoying to undo...'

      const confirmed = await dialog.value.open()

      if (id && confirmed) {
        try {
          showEditor.value = false

          await store.dispatch('blogPost/deletePost', id)

          blogPosts.value = blogPosts.value.filter(p => p.id !== id)
          store.dispatch('blogPost/selectPost', null)
        } catch (err) {
          showEditor.value = false
          errors.value = err.message || err

          store.dispatch('blogPost/selectPost', null)

          loading.value = false
          snackbar.value = true
        }
      } else if (confirmed) {
        showEditor.value = false

        store.dispatch('blogPost/selectPost', null)
      }
    }
    const updateTags = e => {
      selectedPost.value.tags = e
    }
    const createdDate = computed(() =>
      selectedPost.value.created ? DateTime.fromISO(selectedPost.value.created).toLocaleString(DateTime.DATETIME_MED) : '',
    )
    const lastUpdated = computed(() =>
      selectedPost.value.lastUpdated ? DateTime.fromISO(selectedPost.value.lastUpdated).toLocaleString(DateTime.DATETIME_MED) : '',
    )
    const editorConfig = ref(defaultEditorConfig)

    const getBlogPosts = async () => {
      try {
        loading.value = true
        await store.dispatch('blogPost/getPosts', {
          params: {
            userId: store.state?.user?.user?.id,
            page: page.value,
            count: count.value,
          },
        })

        loading.value = false
      } catch (err) {
        errors.value = err.message || err
        snackbar.value = true
      }
    }

    const onFilePicked = async () => {
      if (file.value.size > 800000) {
        alert('file is too large')
        return
      }

      const fr = new FileReader()
      fr.readAsDataURL(file.value)
      fr.addEventListener('load', async () => {
        selectedPost.value.image = fr.result
      })
    }

    const saveFile = async () => {
      if (file.value) {
        const fd = new FormData()

        fd.append('file', file.value, file.value.name)

        await refreshCredentials()

        const res = await axios.post('/api/image', fd, {
          headers: {
            Authorization: 'Bearer ' + store.state?.user?.user?.token,
            'Content-Type': 'multipart/form-data',
          },
        })

        return res.data.location
      }
    }

    watch(page, async (cur, prev) => {
      await getBlogPosts()
    })

    onMounted(async () => {
      await getBlogPosts()
    })

    return {
      page,
      count,
      blogPosts,
      total,
      error,
      selectPost,
      editorConfig,
      createdDate,
      lastUpdated,
      updatePost,
      createPost,
      close,
      saveAndClose,
      loading,
      errors,
      snackbar,
      dialog,
      deletePost,
      updateTags,
      headline,
      message,
      selectedPost,
      showEditor,
      file,
      onFilePicked,
    }
  },
}
</script>

<style lang="scss" scoped>
.blogPost-list {
  height: 100%;
}

.pagination {
  position: fixed;
  bottom: 0;
  padding: 1rem;
  width: 100%;
}
</style>
