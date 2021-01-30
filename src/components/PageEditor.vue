<template>
  <span>
    <v-tabs v-model="tab" show-arrows>
      <v-tabs-slider color="teal lighten-3" />
      <v-tab v-for="(page, i) in pages" :key="page.id" :href="`#tab-${i}`">
        {{ page.title }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(page, i) in pages" :key="page.id" :value="`tab-${i}`">
        <Editor v-model="page.content" :init="editorConfig" />
      </v-tab-item>
    </v-tabs-items>
  </span>
</template>

<script>
import axios from 'axios'
import { ref, onMounted, onBeforeMount } from '@vue/composition-api'
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

export default {
  name: 'PageEditor',
  components: { Editor },
  setup() {
    const pages = ref([])
    const getPages = async () => {
      try {
        const pgs = await axios.get('/api/page')
        console.log('🚀 ~ file: PageEditor.vue ~ line 53 ~ onMounted ~ pgs', pgs)
        pages.value.push(...pgs?.data?.data)
        loading.value = false
      } catch (err) {
        console.error(err)
      }
    }
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
    const tab = ref('tab-0')
    onBeforeMount(async () => {})
    onMounted(async () => {
      await getPages()
    })
    return { pages, loading, editorConfig, tab }
  },
}
</script>

<style lang="scss" scoped></style>
