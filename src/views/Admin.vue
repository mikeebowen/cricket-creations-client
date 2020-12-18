<template>
  <v-container v-if="selectedPost">
    <Editor :init="editorConfig" />
  </v-container>
  <v-container v-else class="post-list d-flex flex-column">
    <v-row>
      <v-col offset="2" cols="10">
        <BlogPostList :posts="posts" @postSelected="selectPost" />
      </v-col>
    </v-row>
    <v-pagination v-model="page" :length="total" :total-visible="9" />
  </v-container>
</template>

<script>
import BlogPostList from '@/components/BlogPostList'
import Editor from '@tinymce/tinymce-vue'
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
import { resolve } from 'path'
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
      console.log('🚀 ~ file: Admin.vue ~ line 34 ~ constselectPost ~ post', post)
      console.log(resolve(__dirname, __filename))
      selectedPost.value = post
    }

    const editorConfig = ref({
      height: 500,
      // menubar: false,
      plugins: ['link', 'table', 'spellchecker', 'image', 'imagetools', 'save', 'lists', 'imagetools', 'codesample', 'code '],
      // tslint:disable-next-line:max-line-length
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
    const editor = ref(null)

    watch(page, async (cur, prev) => {
      await getBlogPosts()
    })

    onMounted(async () => {
      console.log('editor: ', editor.value)
      await getBlogPosts()
    })
    return { page, count, posts, total, error, selectPost, editorConfig, selectedPost, editor }
  },
}
</script>

<style lang="scss" scoped>
.post-list {
  height: 100%;
}
</style>
