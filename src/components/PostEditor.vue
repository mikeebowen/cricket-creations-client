<template>
  <span v-if="selectedPost" class="post-list d-flex flex-column">
    <v-row>
      <v-col cols="3">
        <v-subheader :inset="true"> Created: {{ createdDate }} </v-subheader>
      </v-col>
      <v-col cols="3">
        <v-subheader :inset="true"> Last Updated: {{ lastUpdated }} </v-subheader>
      </v-col>
      <v-col cols="4 d-flex justify-end">
        <v-btn-toggle>
          <v-btn tile @click="updatePost">Save</v-btn>
          <v-btn tile @click="saveAndClose">Save & Close</v-btn>
          <v-btn tile @click="close">Close Without Saving</v-btn>
          <v-btn class="activator" tile @click="openDialog">Delete</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9" offset="1">
        <TagEditor :tags="selectedPost.tags" @new-tags="updateTags" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9" offset="1">
        <v-text-field v-model="selectedPost.title" label="Title" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9" offset="1">
        <v-skeleton-loader v-if="loading" class="mx-auto" :type="`list-item@${count}`" />
        <Editor v-else v-model="selectedPost.content" :init="editorConfig" />
      </v-col>
    </v-row>
    <ConfirmDialog
      :headline="`Are you sure you want to delete ${selectedPost && selectedPost.title}?`"
      message="This will be super annoying to undo..."
      activator-class="activator"
      :dialog="dialog"
      @submit="deletePost"
    />
    <ConfirmDialog
      :headline="`There are unsaved changes to ${selectedPost && selectedPost.title}.`"
      message="Do you want to discard them?"
      activator-class="activator"
      :dialog="dialog2"
      @submit="confirmDiscard"
    />
  </span>
  <span v-else class="post-list d-flex flex-column">
    <v-row>
      <v-col cols="1" offset="1">
        <v-btn color="gray" depressed outlined class="grey--text text--darken-3" @click="createPost">
          <v-icon v-text="'mdi-plus-thick'" />
        </v-btn>
      </v-col>
      <v-col cols="10">
        <v-skeleton-loader v-if="loading" class="mx-auto" :type="`list-item@${count}`" />
        <BlogPostList :posts="posts" @postSelected="selectPost" />
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
import Post from '@/models/Post'
import { isEqual } from '@/utils/'
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
import axios from 'axios'
import { DateTime } from 'luxon'
import { ref, onMounted, watch, computed } from '@vue/composition-api'

export default {
  name: 'Admin',
  components: { BlogPostList, Editor, TagEditor, ConfirmDialog },
  setup() {
    const page = ref(1)
    const count = ref(10)
    const posts = ref([])
    const t = ref(0)
    const error = ref('')
    const total = computed(() => parseInt(t.value / count.value + 1))
    const loading = ref(true)
    const dialog = ref(false)
    const dialog2 = ref(false)
    const openDialog = () => {
      dialog.value = true
      const { id } = selectedPost.value
      if (id) {
        dialog.value = true
      } else {
        deletePost(true)
      }
    }
    const getBlogPosts = async () => {
      try {
        const ps = await axios.get('/api/blogpost', { params: { userId: 1, page: page.value, count: count.value } })
        posts.value.length = 0
        t.value = ps?.data?.meta?.total
        posts.value.push(...ps?.data?.data)
        loading.value = false
      } catch (err) {
        errors.value = err.message || err
        snackbar.value = true
      }
    }
    const selectedPost = ref(null)
    const cachedPost = ref(null)
    const errors = ref(null)
    const snackbar = ref(false)
    const selectPost = post => {
      selectedPost.value = new Post(post)
      cachedPost.value = new Post(post)
    }
    const createPost = () => {
      selectedPost.value = new Post({})
      cachedPost.value = new Post({})
    }
    const updatePost = async () => {
      try {
        if (selectedPost.value.id) {
          loading.value = true
          const updatedPost = await axios.patch(`/api/blogpost/${selectedPost.value.id}`, selectedPost.value.patchData)
          const i = posts.value.findIndex(p => p.id == updatedPost.data.id)
          posts.value[i] = updatedPost.data.data
          selectedPost.value = new Post(updatedPost.data.data)
          cachedPost.value = new Post(updatedPost.data.data)
          loading.value = false
        } else {
          loading.value = true
          const newPost = await axios.post('/api/blogpost', selectedPost.value.postData)
          selectedPost.value = new Post(newPost.data.data)
          cachedPost.value = new Post(newPost.data.data)
          loading.value = false
        }
      } catch (err) {
        errors.value = err.message || err
        close()
        loading.value = false
        snackbar.value = true
      }
    }
    const confirmDiscard = e => {
      if (e) {
        selectedPost.value = null
        cachedPost.value = null
      }
      dialog2.value = false
    }
    const close = () => {
      if (!isEqual(selectedPost.value, cachedPost.value)) {
        dialog2.value = true
      } else {
        selectedPost.value = null
        cachedPost.value = null
      }
    }
    const saveAndClose = async () => {
      await updatePost()
      close()
    }
    const deletePost = async e => {
      const { id } = selectedPost.value
      dialog.value = false
      if (id && e) {
        try {
          await axios.delete(`/api/blogpost/${id}`)
          posts.value = posts.value.filter(p => p.id !== id)
          selectedPost.value = null
          cachedPost.value = null
          close()
        } catch (err) {
          errors.value = err.message || err
          close()
          loading.value = false
          snackbar.value = true
        }
      } else if (e) {
        selectedPost.value = null
        cachedPost.value = null
        close()
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
    const editorConfig = ref({
      height: 500,
      // menubar: false,
      plugins: ['link', 'table', 'spellchecker', 'image', 'imagetools', 'save', 'lists', 'imagetools', 'codesample', 'code '],
      toolbar:
        'insertfile undo redo | code | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image codesample | save cancel',
      menubar: 'file edit insert view format table tools image',
      browser_spellcheck: true,
      codesample_languages: [
        { text: 'HTML/XML', value: 'markup' },
        { text: 'JavaScript', value: 'javascript' },
        { text: 'CSS', value: 'css' },
        { text: 'PHP', value: 'php' },
        { text: 'Ruby', value: 'ruby' },
        { text: 'Python', value: 'python' },
        { text: 'Java', value: 'java' },
        { text: 'C', value: 'c' },
        { text: 'C#', value: 'csharp' },
        { text: 'C++', value: 'cpp' },
      ],
    })

    watch(page, async (cur, prev) => {
      await getBlogPosts()
    })

    onMounted(async () => {
      await getBlogPosts()
    })

    return {
      page,
      count,
      posts,
      total,
      error,
      selectPost,
      editorConfig,
      selectedPost,
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
      dialog2,
      openDialog,
      deletePost,
      updateTags,
      confirmDiscard,
    }
  },
}
</script>

<style lang="scss" scoped>
.post-list {
  height: 100%;
}

.pagination {
  position: fixed;
  bottom: 0;
  padding: 1rem;
  width: 100%;
}
</style>
