<template>
  <v-form v-model="valid">
    <v-row>
      <v-col cols="3" offset="1">
        <v-img :src="user.avatar" max-width="300" max-height="300">
          <template v-slot:placeholder>
            <v-progress-circular indeterminate color="grey lighten-4" />
          </template>
        </v-img>
      </v-col>
      <v-col cols="8 d-flex align-end">
        <v-file-input v-model="file" label="Select New Avatar" prepend-icon="mdi-camera" accept="image/*" @change="onFilePicked" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5" offset="1">
        <v-text-field v-model="user.name" required :rules="[rules.required, rules.maxLength]" label="Name" />
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="user.surname" :rules="[rules.required, rules.maxLength]" required label="Surname" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5" offset="1">
        <v-text-field v-model="user.userName" required :rules="[rules.required, rules.maxLength]" label="User Name" />
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="user.email" required :rules="[rules.required, rules.maxLength, rules.email]" label="Email" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn-toggle>
          <v-btn tile @click="saveUser">Save Changes</v-btn>
          <v-btn tile @click="cancelUserUpdate">Cancel</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'

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

    const onFilePicked = () => {
      if (file.value.size > 800000) {
        alert('file is too large')
        return
      }
      const fr = new FileReader()
      fr.readAsDataURL(file.value)
      fr.addEventListener('load', () => {
        user.value.avatar = fr.result
      })
    }

    const saveUser = async () => {
      await store.dispatch('user/saveUser', user.value)
    }

    const cancelUserUpdate = () => {
      user.value = Object.assign({}, store.state.user.user)
    }

    return { user, valid, rules, onFilePicked, saveUser, cancelUserUpdate, file }
  },
})
</script>

<style lang="scss" scoped></style>
