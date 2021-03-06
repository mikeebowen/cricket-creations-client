<template>
  <span>
    <v-skeleton-loader v-if="loading" class="mx-auto my-10" type="article, paragraph, paragraph, paragraph, paragraph" />
    <span v-else>
      <v-row>
        <v-col cols="9" offset="1">
          <v-tabs v-model="tabIndex" show-arrows centered>
            <v-tabs-slider color="teal lighten-3" />
            <v-tab v-for="(page, i) in pages" :key="page.id" :href="`#${i}`">
              <span v-if="page.id">
                {{ page.title }}
              </span>
              <v-icon v-else v-text="'mdi-plus-thick'" />
            </v-tab>
          </v-tabs>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <v-subheader inset> Created: {{ createdDate }} </v-subheader>
        </v-col>
        <v-col cols="3">
          <v-subheader inset> Last Updated: {{ lastUpdated }} </v-subheader>
        </v-col>
        <v-col cols="4 d-flex justify-end">
          <v-btn-toggle>
            <v-btn tile @click="savePage">Save</v-btn>
            <v-btn class="activator" tile @click="deletePage">Delete</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" offset="1">
          <v-text-field v-if="pages[tabIndex]" v-model="pages[tabIndex].title" label="Title" />
        </v-col>
        <v-col cols="5">
          <v-text-field v-if="pages[tabIndex]" v-model="pages[tabIndex].heading" label="Heading" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="9" offset="1">
          <v-tabs-items v-model="tabIndex">
            <template v-for="(page, i) in pages">
              <v-tab-item :key="page.id" :value="`${i}`">
                <Editor v-model="page.content" :init="editorConfig" />
              </v-tab-item>
            </template>
          </v-tabs-items>
        </v-col>
      </v-row>
      <v-snackbar v-model="snackbar" text color="red">
        <p>Something went wrong, your post couldn't save.</p>
        <v-icon color="red">mdi-alert</v-icon>
        {{ errors }}
      </v-snackbar>
    </span>
    <ConfirmDialog
      ref="dialog"
      :headline="headline"
      message="This will be very annoying to undo..."
      activator-class="activator"
    />
  </span>
</template>

<script>
import { ref, onMounted, computed } from '@vue/composition-api'
import { DateTime } from 'luxon'
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
import ConfirmDialog from '@/components/ConfirmDialog'
import store from '@/store/store'

export default {
  name: 'PageEditor',
  components: { Editor, ConfirmDialog },
  // props: { pages: { type: Array, default: () => [] }, cachedPages: { type: Array, default: () => [] } },
  setup() {
    const newPage = ref('')
    const tabIndex = ref('0')
    const dialog = ref(null)
    const headline = computed(
      () => `Are you sure you want to delete "${pages.value[tabIndex.value] && pages.value[tabIndex.value].title}"?`,
    )
    const pages = computed(() => store.state.page.pages)
    const loading = ref(true)
    const getPages = async () => {
      try {
        await store.dispatch('page/getPages')
        loading.value = false
      } catch (err) {
        errors.value = err.message || err
        loading.value = false
        snackbar.value = true
      }
    }
    const errors = ref(null)
    const snackbar = ref(false)
    const selectedFileName = computed(() => pages.value[tabIndex.value].title)
    const savePage = async () => {
      try {
        loading.value = true
        store.dispatch('page/updatePage', pages.value[tabIndex.value])
        loading.value = false
      } catch (err) {
        errors.value = err.message || err
        loading.value = false
        snackbar.value = true
      }
    }
    const deletePage = async () => {
      const { id } = pages.value[tabIndex.value]
      const confirmed = await dialog.value.open()
      if (confirmed) {
        try {
          loading.value = true
          await store.dispatch('page/deletePage', id)
        } catch (err) {
          errors.value = err.message || err
          loading.value = false
          snackbar.value = true
        }
      }
      loading.value = false
    }
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
    const createdDate = computed(() =>
      pages.value[tabIndex.value]?.created
        ? DateTime.fromISO(pages.value[tabIndex.value].created).toLocaleString(DateTime.DATETIME_MED)
        : '',
    )
    const lastUpdated = computed(() =>
      pages.value[tabIndex.value]?.lastUpdated
        ? DateTime.fromISO(pages.value[tabIndex.value].lastUpdated).toLocaleString(DateTime.DATETIME_MED)
        : '',
    )
    onMounted(async () => {
      await getPages()
    })
    return {
      loading,
      editorConfig,
      tabIndex,
      newPage,
      createdDate,
      lastUpdated,
      savePage,
      errors,
      snackbar,
      dialog,
      headline,
      deletePage,
      selectedFileName,
      pages,
    }
  },
}
</script>

<style lang="scss"></style>
