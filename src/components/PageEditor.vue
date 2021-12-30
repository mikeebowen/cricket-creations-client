<template>
  <span>
    <v-skeleton-loader v-if="loading" class="mx-auto my-10" type="article, paragraph, paragraph, paragraph, paragraph" />
    <span v-else>
      <v-row>
        <v-col xl="6" lg="8" sm="10" offset-xl="3" offset-lg="2" offset-sm="1">
          <v-tabs v-model="tabIndex" show-arrows centered>
            <v-tabs-slider color="teal lighten-3" />
            <v-tab v-for="(page, i) in pages" :key="page.id" :href="`#${i}`">
              {{ page.title }}
            </v-tab>
            <v-tab :href="`#${pages.length - 1}`">
              <v-icon color="blue" @click="addNewPage()" v-text="'mdi-plus-thick'" />
            </v-tab>
          </v-tabs>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" offset-xl="3" offset-md="1" offset-sm="1">
          <v-subheader> Created: {{ createdDate }} </v-subheader>
        </v-col>
        <v-col cols="2">
          <v-subheader> Last Updated: {{ lastUpdated }} </v-subheader>
        </v-col>
        <v-col xl="2" lg="4" sm="6" class="d-flex justify-end">
          <v-btn-toggle>
            <v-btn tile :disabled="noChanges" @click="savePage">Save</v-btn>
            <v-btn class="activator" tile @click="deletePage">Delete</v-btn>
            <v-btn tile @click="discardChanges">Discard</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-row>
        <v-col xl="2" lg="3" md="4" sm="4" offset-xl="3" offset-lg="2" offset-sm="1">
          <v-text-field v-if="pages[tabIndex]" v-model="pages[tabIndex].title" label="Title" />
        </v-col>
        <v-col xl="2" lg="3" md="4" sm="4">
          <v-text-field v-if="pages[tabIndex]" v-model="pages[tabIndex].heading" label="Heading" />
        </v-col>
        <v-col lg="2" md="2" sm="1" class="d-flex justify-end">
          <v-switch v-if="pages[tabIndex]" v-model="pages[tabIndex].published" inset label="published" />
        </v-col>
      </v-row>
      <v-row>
        <v-col xl="6" lg="8" sm="10" offset-xl="3" offset-lg="2" offset-sm="1">
          <v-tabs-items v-model="tabIndex">
            <template v-for="(page, i) in pages">
              <v-tab-item :key="page.id" :value="`${i}`">
                <Editor v-model="page.content" :init="editorConfig" />
              </v-tab-item>
            </template>
          </v-tabs-items>
        </v-col>
      </v-row>
      <v-snackbar v-model="snackbar" text color="red" timeout="-1">
        <v-btn icon small bottom right absolute>
          <v-icon color="red" @click="snackbar = false">mdi-close-thick</v-icon>
        </v-btn>
        <p>Something went wrong, your page couldn't save.</p>
        <ul class="no-bullets">
          <li v-for="(error, i) in errors" :key="i">
            <v-icon color="red">mdi-alert</v-icon>
            {{ error[0] }}
            <ul class="no-bullets">
              <li v-for="errMsg in error[1]" :key="errMsg" style="margin-left: 2rem">
                {{ errMsg }}
              </li>
            </ul>
          </li>
        </ul>
      </v-snackbar>
    </span>
    <ConfirmDialog ref="dialog" :headline="headline" message="This will be very annoying to undo..." activator-class="activator" />
    <ConfirmDialog
      ref="changeWarning"
      :headline="saveWarningHeadline"
      message="Do you want to save them?"
      false-text="Discard"
      true-text="Save"
    />
  </span>
</template>

<script>
import { ref, onMounted, computed, watch } from '@vue/composition-api'
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
import isEqual from 'lodash.isequal'
import { defaultEditorConfig } from '@/utils/utils'

export default {
  name: 'PageEditor',
  components: { Editor, ConfirmDialog },
  setup() {
    const tabIndex = ref('0')

    watch(tabIndex, async (cur, prev) => {
      if (!cachedPages.value[prev] || !isEqual(pages.value[prev], cachedPages.value[prev])) {
        await warn(prev)
      }
    })

    const dialog = ref(null)
    const changeWarning = ref(null)

    const headline = computed(
      () => `Are you sure you want to delete "${pages.value[tabIndex.value] && pages.value[tabIndex.value].title}"?`,
    )

    const unsavedPageTitle = ref('')
    const saveWarningHeadline = computed(() => `"${unsavedPageTitle.value}" has unsaved changes.`)

    const pages = computed(() => store.state.page.pages)
    const cachedPages = computed(() => store.state.page.cachedPages)
    const loading = ref(true)

    const getPages = async () => {
      try {
        await store.dispatch('page/getAllPages')
        loading.value = false
      } catch (err) {
        errors.value = Object.entries(err?.response?.data?.errors) || [err?.message] || [err]
        loading.value = false
        snackbar.value = true
      }
    }

    const errors = ref([])
    const snackbar = ref(false)
    const selectedFileName = computed(() => pages.value[tabIndex.value].title)
    const noChanges = computed(
      () =>
        store.state.page.pages.length === store.state.page.cachedPages.length &&
        store.state.page.pages.every((o, idx) => o && store.state.page.cachedPages[idx] && isEqual(o, store.state.page.cachedPages[idx])),
    )

    const savePage = async i => {
      try {
        let page = pages.value[tabIndex.value]
        const iNum = parseInt(i)

        if (i && !isNaN(iNum)) {
          page = pages.value[i]
        }

        loading.value = true
        const idx = tabIndex.value
        await store.dispatch('page/updatePage', page)
        tabIndex.value = idx
        loading.value = false
      } catch (err) {
        errors.value = Object.entries(err?.response?.data?.errors) || [err?.message] || [err]
        loading.value = false
        snackbar.value = true
      }
    }

    const deletePage = async () => {
      const { id } = pages.value[tabIndex.value]
      const confirmed = await dialog.value.open()

      if (confirmed && id) {
        try {
          loading.value = true

          await store.dispatch('page/deletePage', id)

          loading.value = false
          tabIndex.value = 0
        } catch (err) {
          errors.value = Object.entries(err?.response?.data?.errors) || [err?.message] || [err]
          loading.value = false
          snackbar.value = true
        }
      } else if (confirmed && !id) {
        const idInt = parseInt(tabIndex.value)

        if (!isNaN(idInt)) {
          pages.value.splice(idInt, 1)
          tabIndex.value = 0
        }
      }
    }

    const discardChanges = () => {
      store.dispatch('page/resetPages')
    }

    const addNewPage = () => {
      store.dispatch('page/addPage')
      tabIndex.value = (pages.value.length - 2).toString()
    }

    const editorConfig = ref(defaultEditorConfig)

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

    const warn = async i => {
      if (cachedPages.value[i]) {
        unsavedPageTitle.value = pages.value[i]?.title
        const discard = await changeWarning.value.open()

        if (!discard) {
          store.dispatch('page/resetPages')
        } else {
          await savePage(i)
        }
      }
    }

    const checkPages = async () => {
      const exists = !!cachedPages.value[tabIndex.value]
      const equal = isEqual(pages.value[tabIndex.value], cachedPages.value[tabIndex.value])
      if (!exists || !equal) {
        await warn(tabIndex.value)
      }
    }

    onMounted(async () => {
      await getPages('admin')
    })

    return {
      loading,
      editorConfig,
      tabIndex,
      createdDate,
      lastUpdated,
      savePage,
      errors,
      snackbar,
      dialog,
      headline,
      saveWarningHeadline,
      deletePage,
      selectedFileName,
      pages,
      addNewPage,
      noChanges,
      changeWarning,
      warn,
      checkPages,
      discardChanges,
    }
  },
}
</script>

<style lang="scss">
ul.no-bullets {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
