<template>
  <v-form v-model="valid">
    <v-row>
      <v-col cols="3" offset="1">
        <v-img
          :src="user.avatar"
          :lazy-src="require('@/assets/images/abstract-user-flat-4.svg')"
          max-width="300"
          max-height="300"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5" />
            </v-row>
          </template>
        </v-img>
      </v-col>
      <v-col cols="8 d-flex align-end">
        <v-file-input
          v-model="file"
          label="File input"
          prepend-icon="mdi-camera"
          accept="image/*"
          @change="onFilePicked"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5" offset="1">
        <v-text-field
          v-model="user.name"
          required
          :rules="[rules.required, rules.maxLength]"
          label="Name"
        />
      </v-col>
      <v-col cols="5">
        <v-text-field
          v-model="user.surname"
          :rules="[rules.required, rules.maxLength]"
          required
          label="Surname"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5" offset="1">
        <v-text-field
          v-model="user.userName"
          required
          :rules="[rules.required, rules.maxLength]"
          label="User Name"
        />
      </v-col>
      <v-col cols="5">
        <v-text-field
          v-model="user.email"
          required
          :rules="[rules.required, rules.maxLength, rules.email]"
          label="Email"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import axios from 'axios'
import store from '@/store/store'

export default defineComponent({
  setup() {
    const user = ref(Object.assign({}, store.state.user.user))
    const valid = ref(true)
    const rules = ref({
      required: n => !!n || 'Required',
      email: n => /.+@.+\..+/.test(n) || 'Email must be valid',
      maxLength: n => n.length <= 200 || 'Max length 200 characters',
    })

    const file = ref(null)

    let imageUrl
    let imageFile
    const onFilePicked = () => {
      // console.log('file: ', file)
      const fr = new FileReader()
      fr.readAsDataURL(file.value)
      fr.addEventListener('load', async () => {
        imageUrl = fr.result
        console.log('🚀 ~ file: AccountEditor.vue ~ line 92 ~ fr.addEventListener ~ fr', fr)
        console.log('🚀 ~ file: AccountEditor.vue ~ line 91 ~ fr.addEventListener ~ imageUrl', imageUrl)
        imageFile = file.value // this is an image file that can be sent to server...
        console.log('🚀 ~ file: AccountEditor.vue ~ line 92 ~ fr.addEventListener ~ imageFile', imageFile)
        const base64String = fr.result.split(',')[1]
        await axios.post('/api/image', { data: base64String, fileName: file?.value?.name })
      })
    }
    return { user, valid, rules, file, onFilePicked }
  },
})
</script>

<style lang="scss" scoped></style>
