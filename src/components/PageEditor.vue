<template>
  <span>
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
    <ConfirmDialog ref="dialog" :headline="headline" message="This will be very annoying to undo..." activator-class="activator" />
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
  props: { pages: { type: Array, default: () => [] }, cachedPages: { type: Array, default: () => [] } },
  setup(props, context) {
    const newPage = ref('')
    const tabIndex = ref('0')
    const dialog = ref(null)
    const headline = computed(
      () => `Are you sure you want to delete "${props.pages[tabIndex.value] && props.pages[tabIndex.value].title}"?`,
    )
    const loading = ref(true)
    const getPages = async () => {
      try {
        const pgs = await axios.get('/api/page')
        props.pages.splice(0, props.pages.length)
        props.pages.push(
          ...pgs?.data?.data.map(p => new Page(p)),
          new Page({
            created: '',
            lastUpdated: '',
            title: '',
            content: '',
            heading: '',
          }),
        )
        props.cachedPages.splice(0, props.cachedPages.length)
        props.cachedPages.push(
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
    const selectedFileName = computed(() => props.pages[tabIndex.value].title)
    const savePage = async () => {
      try {
        if (props.pages[tabIndex.value].id) {
          loading.value = true
          const updatedPage = await axios.patch(`/api/page/${props.pages[tabIndex.value].id}`, props.pages[tabIndex.value].patchData)
          props.pages[tabIndex.value] = new Page(updatedPage.data.data)
          props.cachedPages.splice(0, props.cachedPages.length)
          props.cachedPages.push(...props.pages)
          loading.value = false
        } else {
          loading.value = true
          const newPage = await axios.post('/api/page', props.pages[tabIndex.value].postData)
          props.pages[tabIndex.value] = new Page(newPage.data.data)
          props.pages.push(
            new Page({
              created: '',
              lastUpdated: '',
              title: '',
              content: '',
              heading: '',
            }),
          )
          props.cachedPages.splice(0, props.cachedPages.length)
          props.cachedPages.push(...props.pages)
          loading.value = false
        }
      } catch (err) {
        errors.value = err.message || err
        loading.value = false
        snackbar.value = true
      }
    }
    const deletePage = async () => {
      const { id } = props.pages[tabIndex.value]
      const confirmed = await dialog.value.open()
      if (confirmed && id) {
        try {
          await axios.delete(`/api/page/${id}`)
          props.pages.splice(tabIndex.value, 1)
          props.cachedPages.splice(0, props.cachedPages.length)
          props.cachedPages.push(...props.pages)
        } catch (err) {
          errors.value = err.message || err
          loading.value = false
          snackbar.value = true
        }
      } else if (confirmed && !id) {
        props.pages.splice(
          tabIndex.value,
          1,
          new Page({
            created: '',
            lastUpdated: '',
            title: '',
            content: '',
            heading: '',
          }),
        )
        props.cachedPages.splice(0, props.cachedPages.length)
        props.cachedPages.push(...props.pages)
      }
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
      props.pages[tabIndex.value]?.created
        ? DateTime.fromISO(props.pages[tabIndex.value].created).toLocaleString(DateTime.DATETIME_MED)
        : '',
    )
    const lastUpdated = computed(() =>
      props.pages[tabIndex.value]?.lastUpdated
        ? DateTime.fromISO(props.pages[tabIndex.value].lastUpdated).toLocaleString(DateTime.DATETIME_MED)
        : '',
    )
    onMounted(async () => {
      await getPages()
      tabIndex.value = '0'
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
    }
  },
}
</script>

<style lang="scss"></style>
