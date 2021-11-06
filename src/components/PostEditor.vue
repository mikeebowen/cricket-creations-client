<template>
  <span v-if="showEditor" class="post-list d-flex flex-column">
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
          <v-btn tile @click="close(true)">Close Without Saving</v-btn>
          <v-btn class="activator" tile @click="deletePost">Delete</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-skeleton-loader v-if="loading" class="mx-auto my-auto" :type="`list-item@${count}`" />
    <v-row v-else>
      <v-col cols="7" offset="1">
        <TagEditor :tags="selectedPost.tags" @new-tags="updateTags" />
      </v-col>
      <v-col cols="2"> <v-switch v-model="selectedPost.published" inset label="published" /></v-col></v-row>
    <v-row>
      <v-col cols="9" offset="1">
        <v-text-field v-model="selectedPost.title" label="Title" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9" offset="1">
        <Editor v-model="selectedPost.content" :init="editorConfig" />
      </v-col>
    </v-row>
    <ConfirmDialog ref="dialog" :headline="headline" :message="message" activator-class="activator" />
  </span>
  <v-skeleton-loader v-else-if="loading" class="mx-auto my-10" type="article, paragraph, paragraph, paragraph, paragraph" />
  <span v-else class="post-list d-flex flex-column">
    <v-row>
      <v-col cols="1" offset="1">
        <v-btn color="gray" depressed outlined class="grey--text text--darken-3" @click="createPost">
          <v-icon v-text="'mdi-plus-thick'" />
        </v-btn>
      </v-col>
      <v-col cols="10">
        <v-skeleton-loader v-if="loading" class="mx-auto" :type="`list-item@${count}`" />
        <BlogPostList v-else :posts="posts" @post-selected="selectPost" />
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
import { isEqual } from '@/utils/utils'
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
import { ref, onMounted, watch, computed } from '@vue/composition-api'

export default {
  name: 'Admin',
  components: { BlogPostList, Editor, TagEditor, ConfirmDialog },
  setup() {
    const page = ref(1)
    const count = ref(10)
    const posts = computed(() => store.state.post.posts)
    const t = computed(() => store.state.post.total)
    const error = ref('')
    const total = computed(() => parseInt(t.value / count.value + 1))
    const loading = ref(true)
    const dialog = ref(null)
    const headline = ref('')
    const message = ref('')
    const errors = ref(null)
    const snackbar = ref(false)
    const selectedPost = computed(() => store.state.post.selectedPost)
    const cachedPost = computed(() => store.state.post.cachedPost)
    const showEditor = ref(false)
    const selectPost = post => {
      store.dispatch('post/selectPost', new Post(post))
      showEditor.value = true
    }
    const createPost = () => {
      store.dispatch('post/selectPost', new Post({}))
      showEditor.value = true
    }
    const updatePost = async () => {
      try {
        loading.value = true
        showEditor.value = false
        await store.dispatch('post/updatePost', selectedPost.value)
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
      if (!isEqual(selectedPost.value, cachedPost.value) && checkEqual) {
        headline.value = `There are unsaved changes to "${selectedPost.value && selectedPost.value.title}".`
        message.value = 'This cannot be undone.'
        const confirm = await dialog.value.open()
        if (confirm) {
          showEditor.value = false
          store.dispatch('post/selectPost', null)
        }
      } else {
        showEditor.value = false
        store.dispatch('post/selectPost', null)
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
          await store.dispatch('post/deletePost', id)
          posts.value = posts.value.filter(p => p.id !== id)
          store.dispatch('post/selectPost', null)
        } catch (err) {
          showEditor.value = false
          errors.value = err.message || err
          store.dispatch('post/selectPost', null)
          loading.value = false
          snackbar.value = true
        }
      } else if (confirmed) {
        showEditor.value = false
        store.dispatch('post/selectPost', null)
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

    const getBlogPosts = async () => {
      try {
        loading.value = true
        await store.dispatch('post/getPosts', {
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
