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
        <v-expansion-panels flat>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <p class="grey--text text--darken-2 text-h5">Tags</p>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-btn depressed small class="grey--text text--darken-3" @click="dialog = true">
                <v-icon v-text="'mdi-tag-plus-outline'" />
              </v-btn>
              <v-chip-group>
                <v-chip v-for="(tag, i) in selectedPost.tags" :key="tag.id" close @click:close="removeTag(i)">{{ tag.name }}</v-chip>
              </v-chip-group>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-actions>
              <v-btn depressed small class="grey--text text--darken-3" @click="dialog = false">
                <v-icon v-text="'mdi-close'" />
              </v-btn>
            </v-card-actions>
            <v-card-title>Create Tag</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="newTagName"
                label="Tag Name"
                append-outer-icon="mdi-plus-box-outline"
                @click:append-outer="addTag({ name: newTagName })"
              />
              <v-expansion-panels flat>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <p class="grey--text text--darken-2 text-h5">Existing Tags</p>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-chip-group column>
                      <v-chip v-for="tag in existingTags" :key="tag.id" @click="addTag(tag)">
                        {{ tag.name }}
                        <v-icon>mdi-check-circle-outline</v-icon>
                      </v-chip>
                    </v-chip-group>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-dialog>
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
    const existingTags = ref([])
    const t = ref(0)
    const error = ref('')
    const total = computed(() => parseInt(t.value / count.value + 1))
    const loading = ref(true)
    const getBlogPosts = async () => {
      try {
        const ps = await axios.get('/api/blogpost', { params: { userId: 1, page: page.value, count: count.value } })
        const tags = await axios.get('/api/tag')
        posts.value.length = 0
        t.value = ps?.data?.meta?.total
        existingTags.value.push(...tags?.data?.data)
        posts.value.push(...ps?.data?.data)
        loading.value = false
      } catch (err) {
        errors.value = err.message || err
        snackbar.value = true
      }
    }
    const selectedPost = ref(null)
    const errors = ref(null)
    const snackbar = ref(false)
    const selectPost = post => {
      selectedPost.value = new Post(post)
    }
    const createPost = () => {
      selectedPost.value = new Post({})
    }
    const updatePost = async () => {
      try {
        if (selectedPost.value.id) {
          loading.value = true
          const updatedPost = await axios.patch(`/api/blogpost/${selectedPost.value.id}`, selectedPost.value.patchData)
          const i = posts.value.findIndex(p => p.id == updatedPost.data.id)
          posts.value[i] = updatedPost.data.data
          selectedPost.value = new Post(updatedPost.data.data)
          loading.value = false
        } else {
          loading.value = true
          const newPost = await axios.post('/api/blogpost', selectedPost.value.postData)
          selectedPost.value = new Post(newPost.data.data)
          loading.value = false
        }
      } catch (err) {
        errors.value = err.message || err
        close()
        loading.value = false
        snackbar.value = true
      }
    }
    const close = () => (selectedPost.value = null)
    const saveAndClose = async () => {
      await updatePost()
      close()
    }
    const newTagName = ref('')
    const addTag = tag => {
      selectedPost.value.tags.push(tag)
      newTagName.value = ''
    }
    const removeTag = index => {
      selectedPost.value.tags.splice(index, 1)
    }
    const dialog = ref(false)
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
      addTag,
      dialog,
      newTagName,
      errors,
      snackbar,
      removeTag,
      existingTags,
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
