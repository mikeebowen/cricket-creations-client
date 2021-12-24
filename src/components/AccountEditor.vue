<template>
  <v-skeleton-loader v-if="loading" class="mt-5 mx-10" type="list-item-avatar, list-item, list-item" />
  <v-form v-else v-model="valid" class="mt-5">
    <v-row>
      <v-col cols="3" offset="1">
        <v-img :src="user.avatar" max-width="300" max-height="300">
          <template v-slot:placeholder>
            <v-progress-circular indeterminate color="grey lighten-4" />
          </template>
        </v-img>
      </v-col>
      <v-col cols="7">
        <div class="text-h2" v-text="user.userName" />
      </v-col>
    </v-row>
    <v-row>
      <v-col offset="1" cols="10">
        <v-file-input v-model="file" label="Select New Avatar" prepend-icon="mdi-camera" accept="image/*" @change="onFilePicked" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5" offset="1">
        <v-text-field v-model="user.name" required :rules="[rules.required, rules.maxLength]" label="Name" />
      </v-col>
      <v-col cols="5">
        <v-text-field v-model="user.surname" :rules="[rules.required, rules.maxLength]" required label="Surname" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5" offset="1">
        <v-text-field v-model="user.email" required :rules="[rules.required, rules.maxLength, rules.email]" label="Email" />
      </v-col>
      <v-col cols="5">
        <v-text-field type="password" label="Password" :value="passwordDots" @click="openPasswordDialog" />
        <v-dialog v-model="dialog" max-width="500" persistent class="">
          <v-card class="px-4">
            <v-card-title>
              <span class="text-h5 mx-auto">Update Password</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="registerForm" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="password"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[rules.required, rules.min]"
                      :type="show ? 'text' : 'password'"
                      name="input-10-1"
                      label="Password"
                      hint="At least 8 characters"
                      counter
                      @click:append="show = !show"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="verify"
                      block
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[rules.required, passwordMatch]"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      label="Confirm Password"
                      counter
                      @click:append="show1 = !show1"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="red darken-1" text @click="dialog = false"> Cancel </v-btn>
              <v-btn color="blue darken-1" text :disabled="!password || password !== verify" @click="updatePassword"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="11" class="d-flex justify-end">
        <v-btn-toggle>
          <v-btn tile :disabled="!userHasUpdates" @click="saveUser">Save Changes</v-btn>
          <v-btn tile @click="cancelUserUpdate">Cancel</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" text color="red" timeout="-1">
      <v-btn icon small bottom right absolute>
        <v-icon color="red" @click="snackbar = false">mdi-close-thick</v-icon>
      </v-btn>
      <p>Something went wrong, your update couldn't save.</p>
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
  </v-form>
</template>

<script>
import { defineComponent, ref, watch, computed } from '@vue/composition-api'
import deepEqual from 'deep-equal'
import debounce from 'lodash.debounce'

import store from '@/store/store'

export default defineComponent({
  setup() {
    const user = ref(Object.assign({}, store.state.user.user))
    const userHasUpdates = ref(false)
    const valid = ref(true)
    const rules = ref({
      required: n => !!n || 'Required',
      email: n => /.+@.+\..+/.test(n) || 'Email must be valid',
      min: n => n.length >= 8 || 'Password must be at least 8 characters',
      maxLength: n => n.length <= 200 || 'Max length 200 characters',
    })
    const password = ref('')
    const verify = ref('')
    const passwordDots = computed(() => {
      let pass = ''

      if (password.value.length) {
        for (let i = 0; i < password.value.length; i++) {
          pass += 'x'
        }
      } else {
        pass = 'this value is never read'
      }

      return pass
    })
    const passwordMatch = computed(() => password.value === verify.value || 'Password must match')
    const dialog = ref(false)
    const show = ref(false)
    const show1 = ref(false)

    const checkForUserChanges = debounce((cur, prev) => {
      if (!deepEqual(cur, store.state.user.user)) {
        userHasUpdates.value = true
      } else {
        userHasUpdates.value = false
      }
    }, 300)

    watch(
      user,
      (cur, prev) => {
        checkForUserChanges(cur, prev)
      },
      { deep: true },
    )

    const file = ref(null)
    const loading = ref(false)

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
      try {
        loading.value = true
        await store.dispatch('user/saveUser', user.value)
        loading.value = false
        userHasUpdates.value = false
      } catch (err) {
        cancelUserUpdate()

        errors.value = Object.entries(err?.response?.data?.errors) || [err?.message] || [err]
        loading.value = false
        snackbar.value = true
      }
    }

    const cancelUserUpdate = () => {
      file.value = null
      user.value = Object.assign({}, store.state.user.user)
    }

    const openPasswordDialog = () => {
      dialog.value = true
    }

    const updatePassword = async () => {
      await store.dispatch('user/updatePassword', password.value)
      dialog.value = false
    }

    const snackbar = ref(false)
    const errors = ref([])

    return {
      user,
      valid,
      rules,
      onFilePicked,
      saveUser,
      cancelUserUpdate,
      file,
      loading,
      userHasUpdates,
      dialog,
      openPasswordDialog,
      passwordMatch,
      show,
      show1,
      password,
      verify,
      updatePassword,
      passwordDots,
      snackbar,
      errors,
    }
  },
})
</script>

<style lang="scss" scoped></style>
