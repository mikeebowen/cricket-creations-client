<template>
  <span>
    <v-row>
      <v-col cols="9" offset="1">
        <v-tabs v-model="tab" show-arrows centered>
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
          <v-btn class="activator" tile @click="openDialog">Delete</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" offset="1">
        <v-text-field v-if="pages[tab]" v-model="pages[tab].title" label="Title" />
      </v-col>
      <v-col cols="5">
        <v-text-field v-if="pages[tab]" v-model="pages[tab].heading" label="Heading" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9" offset="1">
        <v-tabs-items v-model="tab">
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
    <ConfirmDialog
      :headline="`Are you sure you want to delete ${pages[tab] && pages[tab].name}?`"
      message="This will be very annoying to undo..."
      activator-class="activator"
      :dialog="dialog"
      @submit="deletePage"
    />
  </span>
</template>

<script>
import axios from 'axios'
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
import Page from '@/models/Page'
import ConfirmDialog from '@/components/ConfirmDialog'

export default {
  name: 'PageEditor',
  components: { Editor, ConfirmDialog },
  setup() {
    const pages = ref([])
    const newPage = ref('')
    const getPages = async () => {
      try {
        const pgs = await axios.get('/api/page')
        pages.value.push(
          ...pgs?.data?.data.map(p => new Page(p)),
          new Page({
            created: '',
            lastUpdated: '',
            title: '',
            content: '',
            heading: '',
          }),
        )
        loading.value = false
      } catch (err) {
        console.error(err)
      }
    }
    const errors = ref(null)
    const snackbar = ref(false)
    const selectedFileName = computed(() => pages.value[tab.value].title)
    const savePage = async () => {
      try {
        if (pages.value[tab.value].id) {
          loading.value = true
          const updatedPage = await axios.patch(`/api/page/${pages.value[tab.value].id}`, pages.value[tab.value].patchData)
          pages.value[tab] = updatedPage.data.data
          pages.value[tab.value] = new Page(updatedPage.data.data)
          loading.value = false
        } else {
          loading.value = true
          const newPage = await axios.post('/api/page', pages.value[tab.value].postData)
          pages.value[tab.value] = new Page(newPage.data.data)
          pages.value.push(
            new Page({
              created: '',
              lastUpdated: '',
              title: '',
              content: '',
              heading: '',
            }),
          )
          loading.value = false
        }
      } catch (err) {
        errors.value = err.message || err
        loading.value = false
        snackbar.value = true
      }
    }
    const openDialog = () => {
      const { id } = pages.value[tab.value]
      if (id) {
        dialog.value = true
      } else {
        deletePage(true)
      }
    }
    const deletePage = async e => {
      const { id } = pages.value[tab.value]
      dialog.value = false
      if (e && id) {
        if (id) {
          try {
            await axios.delete(`/api/page/${id}`)
            pages.value.splice(tab.value, 1)
          } catch (err) {
            errors.value = err.message || err
            loading.value = false
            snackbar.value = true
          }
        }
      } else if (e && !id) {
        pages.value.splice(
          tab.value,
          1,
          new Page({
            created: '',
            lastUpdated: '',
            title: '',
            content: '',
            heading: '',
          }),
        )
      }
    }
    const dialog = ref(false)
    const loading = ref(true)
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
    const tab = ref('0')
    const createdDate = computed(() =>
      pages.value[tab.value]?.created ? DateTime.fromISO(pages.value[tab.value].created).toLocaleString(DateTime.DATETIME_MED) : '',
    )
    const lastUpdated = computed(() =>
      pages.value[tab.value]?.lastUpdated ? DateTime.fromISO(pages.value[tab.value].lastUpdated).toLocaleString(DateTime.DATETIME_MED) : '',
    )
    onMounted(async () => {
      await getPages()
      tab.value = '0'
    })
    return {
      pages,
      loading,
      editorConfig,
      tab,
      newPage,
      createdDate,
      lastUpdated,
      savePage,
      errors,
      snackbar,
      dialog,
      openDialog,
      deletePage,
      selectedFileName,
    }
  },
}
</script>

<style lang="scss"></style>
