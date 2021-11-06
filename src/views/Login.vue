<template>
  <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
    <div>
      <v-tabs v-model="tab" show-arrows :background-color="primaryColorAdmin" icons-and-text dark grow>
        <v-tabs-slider :color="accentColorAdmin" />
        <v-tab v-for="(tab, i) in tabs" :key="i" :disabled="tab.disabled">
          <v-icon large>{{ tab.icon }}</v-icon>
          <div class="caption py-1">{{ tab.name }}</div>
        </v-tab>
        <v-tab-item>
          <v-card class="px-4">
            <v-card-text>
              <v-form ref="loginForm" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="loginEmail" :rules="loginEmailRules" label="E-mail" required />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="loginPassword"
                      :append-icon="show1 ? 'eye' : 'eye-off'"
                      :rules="[rules.required, rules.min]"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      label="Password"
                      hint="At least 8 characters"
                      counter
                      @click:append="show1 = !show1"
                      @keyup.enter="login"
                    />
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6" xsm="12" />
                  <v-spacer />
                  <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                    <v-btn x-large block :disabled="!valid" color="success" @click="login"> Login </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card class="px-4">
            <v-card-text>
              <v-form ref="registerForm" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="firstName" :rules="[rules.required]" label="First Name" maxlength="20" required />
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="lastName" :rules="[rules.required]" label="Last Name" maxlength="20" required />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="email" :rules="emailRules" label="Email" required />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="userName" :rules="[rules.required]" label="UserName" maxlength="20" required />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="password"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[rules.required, rules.min]"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      label="Password"
                      hint="At least 8 characters"
                      counter
                      @click:append="show1 = !show1"
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
                  <v-spacer />
                  <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                    <v-btn x-large block :disabled="!valid" color="success" @click="login"> Register </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </div>
  </v-dialog>
</template>

<script>
import { ref, computed, onBeforeMount } from '@vue/composition-api'
import router from '@/router'

import store from '@/store/store'
import scssVariables from '@/variables.scss'

export default {
  name: 'LoginForm',
  setup(props, { root }) {
    const primaryColorAdmin = ref(scssVariables.primaryColorAdmin)
    const accentColorAdmin = ref(scssVariables.accentColorAdmin)
    const dialog = ref(true)
    const tab = ref(0)
    const tabs = ref([
      { name: 'Login', icon: 'mdi-account', disabled: false },
      { name: 'Register', icon: 'mdi-account-outline', disabled: false },
    ])
    const valid = ref(true)

    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const userName = ref('')
    const password = ref('')
    const verify = ref('')
    const loginPassword = ref('')
    const loginEmail = ref('')
    const loginEmailRules = ref([v => !!v || 'Required', v => /.+@.+\..+/.test(v) || 'Email must be valid'])
    const emailRules = ref([v => !!v || 'Required', v => /.+@.+\..+/.test(v) || 'Email must be valid'])
    const passwordMatch = computed(() => password.value === verify.value || 'Password must match')
    const loading = ref(false)

    const show1 = ref(false)
    const rules = ref({
      required: value => !!value || 'Required.',
      min: v => (v && v.length >= 8) || 'Min 8 characters',
    })
    const loginForm = ref(null)
    const registerForm = ref(null)

    const login = async () => {
      if (loginForm.value.validate()) {
        await store.dispatch('user/login', { password: loginPassword.value, userName: loginEmail.value })
        const user = store.state?.user?.user
        if (user) {
          router.push('admin')
        }
      }
    }

    // const register = async () => {
    //   if (registerForm.value.validate()) {
    //   }
    // }
    const reset = () => {
      registerForm.value.reset()
    }
    const resetValidation = () => {
      registerForm.value.resetValidation()
    }

    onBeforeMount(() => {
      if (store.state.user) {
        router.push('admin')
      }
    })

    return {
      primaryColorAdmin,
      accentColorAdmin,
      dialog,
      tab,
      tabs,
      valid,
      firstName,
      lastName,
      email,
      userName,
      password,
      verify,
      loginPassword,
      loginEmail,
      loginEmailRules,
      emailRules,
      show1,
      rules,
      passwordMatch,
      loginForm,
      registerForm,
      login,
      reset,
      resetValidation,
      // register,
      loading,
    }
  },
}
</script>

<style lang="scss" scoped></style>
