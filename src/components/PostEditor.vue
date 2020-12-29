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
          <v-btn tile @click="close">Close</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
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
  </span>
  <span v-else class="post-list d-flex flex-column">
    <v-row>
      <v-col cols="1" offset="1">
        <v-btn color="gray" @click="createPost">
          <v-icon v-text="'mdi-plus-thick'" />
        </v-btn>
      </v-col>
      <v-col cols="10">
        <BlogPostList :posts="posts" @postSelected="selectPost" />
      </v-col>
    </v-row>
    <v-pagination v-model="page" :length="total" :total-visible="9" class="pagination" />
  </span>
</template>

<script>
import BlogPostList from '@/components/BlogPostList'
import Editor from '@tinymce/tinymce-vue'
import Post from '@/models/Post'
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
  components: { BlogPostList, Editor },
  setup() {
    const page = ref(1)
    const count = ref(10)
    const posts = ref([])
    const t = ref(0)
    const error = ref('')
    const total = computed(() => parseInt(t.value / count.value + 1))
    const getBlogPosts = async () => {
      const ps = await axios.get('/api/blogpost', { params: { userId: 1, page: page.value, count: count.value } })
      posts.value.length = 0
      t.value = ps?.data?.meta?.total
      posts.value.push(...ps?.data?.data)
    }
    const selectedPost = ref(null)
    const selectPost = post => {
      selectedPost.value = new Post(post)
    }
    const createPost = () => {
      selectedPost.value = new Post({})
    }
    const updatePost = async () => {
      if (selectedPost.value.userId) {
        const updatedPost = await axios.patch(`/api/blogpost/${selectedPost.value.id}`, selectedPost.value.patchData)
        const i = posts.value.findIndex(p => p.id == updatedPost.data.id)
        posts.value[i] = updatedPost.data.data
        selectedPost.value = new Post(updatedPost.data.data)
      } else {
        const newPost = await axios.post('/api/blogpost', selectedPost.value.postData)
        selectedPost.value = new Post(newPost.data.data)
      }
    }
    const close = () => (selectedPost.value = null)
    const saveAndClose = async () => {
      await updatePost()
      close()
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
