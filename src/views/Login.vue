<template>
  <v-container>
    <v-dialog v-model="showLoginDialog" persistent max-width="600px" min-width="360px">
      <div v-if="loading" class="loading">
        <v-progress-circular :size="100" :width="10" color="blue" indeterminate />
      </div>
      <v-tabs v-else v-model="tab" show-arrows :background-color="primaryColorAdmin" icons-and-text dark grow :class="{ shake: animated }">
        <v-tabs-slider :color="accentColorAdmin" />
        <v-tab v-for="(tab, i) in tabs" :key="i" :disabled="tab.disabled">
          <v-icon large>{{ tab.icon }}</v-icon>
          <div class="caption py-1">{{ tab.name }}</div>
        </v-tab>
        <v-tab-item>
          <v-card class="px-4">
            <v-card-text>
              <v-form ref="loginForm" v-model="loginFormValid">
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="loginEmail" :rules="emailRules" label="Email" type="email" required />
                  </v-col>
                </v-row>
                <v-row>
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
                </v-row>
                <v-row :class="{ 'flex-column-reverse': $vuetify.breakpoint.xs }">
                  <v-col cols="12" sm="9" class="d-flex align-end">
                    <v-btn text color="primary" @click="switchDialogs">Forgot Password?</v-btn>
                  </v-col>
                  <v-col cols="12" sm="2" :class="{ 'd-flex': $vuetify.breakpoint.xs, 'justify-center': $vuetify.breakpoint.xs }">
                    <v-btn x-large :disabled="!loginFormValid" color="success" align-end @click="login"> Login </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card class="px-4">
            <v-img src="@/assets/images/1024px-Sphynx_kittens._img_020.jpg" class="white--text align-end">
              <v-card-title class="justify-center">Registration is disabled.</v-card-title>
            </v-img>
            <!-- <v-card-text>
              <v-form ref="registerForm" v-model="registerFormValid" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="name" :rules="[rules.required]" label="First Name" maxlength="20" required />
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="surname" :rules="[rules.required]" label="Last Name" maxlength="20" required />
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
                    <v-btn x-large block :disabled="!registerFormValid" color="success" @click="register"> Register </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text> -->
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-dialog>
    <v-dialog v-model="showResetPasswordDialog" persistent max-width="600px" min-width="360px">
      <v-card>
        <v-card-title> Reset Password </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12"> Enter your email address and we'll send you instructions to reset your password </v-col>
          </v-row>
          <v-form v-model="resetPasswordFormValid">
            <v-row class="px-4">
              <v-col cols="12">
                <v-text-field
                  v-model="resetPasswordEmail"
                  :rules="emailRules"
                  type="email"
                  label="Email Address"
                  :class="{ shake: invalidResetEmail }"
                />
              </v-col>
            </v-row>
            <v-row :class="{ 'flex-column-reverse': $vuetify.breakpoint.xs }">
              <v-col cols="12" sm="9" class="d-flex align-end">
                <v-btn text color="primary" @click="switchDialogs">Login with your credentials</v-btn>
              </v-col>
              <v-col cols="12" sm="2" :class="{ 'd-flex': $vuetify.breakpoint.xs, 'justify-center': $vuetify.breakpoint.xs }">
                <v-btn x-large :disabled="!resetPasswordFormValid" color="primary" align-end @click="sendResetPasswordCode">Reset</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showCheckEmailDialog" persistent max-width="600px" min-width="360px">
      <v-card>
        <v-card-title> Reset password code sent </v-card-title>
        <v-card-text> Please check your inbox for the password reset code. </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" text color="red">
      <p class="text-center">{{ errTitle }}</p>
      <v-icon color="red">mdi-alert</v-icon>
      {{ errMsg }}
    </v-snackbar>
  </v-container>
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
    const showLoginDialog = ref(true)
    const showResetPasswordDialog = ref(false)
    const showCheckEmailDialog = ref(false)
    const snackbar = ref(false)
    const animated = ref(false)
    const invalidResetEmail = ref(false)
    const tab = ref(0)
    const tabs = ref([
      { name: 'Login', icon: 'mdi-account', disabled: false },
      { name: 'Register', icon: 'mdi-account-outline', disabled: false },
    ])
    const loginFormValid = ref(false)
    const registerFormValid = ref(false)
    const resetPasswordFormValid = ref(false)
    const errMsg = ref('')
    const errTitle = ref('')

    const name = ref('')
    const surname = ref('')
    const email = ref('')
    const userName = ref('')
    const password = ref('')
    const verify = ref('')
    const loginPassword = ref('')
    const loginEmail = ref('')
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
        try {
          loading.value = true
          await store.dispatch('user/login', { password: loginPassword.value, userName: loginEmail.value })
          const user = store.state?.user?.user

          if (user) {
            router.push('admin')
            loading.value = false
          }
        } catch (err) {
          errTitle.value = 'Login Failed'
          errMsg.value = 'Username or password is incorrect.'
          loading.value = false
          snackbar.value = true
          loginPassword.value = ''
          loginEmail.value = ''
          animated.value = true

          setTimeout(() => {
            animated.value = false
          }, 500)
        }
      }
    }

    const register = async () => {
      try {
        if (registerForm.value.validate()) {
          loading.value = true
          await store.dispatch('user/register', {
            name: name.value,
            surname: surname.value,
            email: email.value,
            userName: userName.value,
            password: password.value,
          })
          loading.value = false
          const user = store.state?.user?.user

          if (user) {
            router.push('admin')
            loading.value = false
          }
        }
      } catch (err) {
        errTitle.value = 'Registration Failed'
        errMsg.value = 'New user registrations are not being accepted at this time.'
        loading.value = false
        snackbar.value = true
        animated.value = true
        name.value = ''
        surname.value = ''
        email.value = ''
        userName.value = ''
        password.value = ''
        verify.value = ''
        tab.value = 0

        setTimeout(() => {
          animated.value = false
        }, 500)
      }
    }
    const reset = () => {
      registerForm.value.reset()
    }
    const resetValidation = () => {
      registerForm.value.resetValidation()
    }

    const resetPasswordEmail = ref('')
    const sendResetPasswordCode = async () => {
      await store.dispatch('user/sendResetPasswordCode', resetPasswordEmail.value)

      showLoginDialog.value = false
      showResetPasswordDialog.value = false
      showCheckEmailDialog.value = true
    }

    const switchDialogs = () => {
      showLoginDialog.value = !showLoginDialog.value
      showResetPasswordDialog.value = !showResetPasswordDialog.value
    }

    onBeforeMount(() => {
      if (store.state.user) {
        router.push('admin')
      }
    })

    return {
      primaryColorAdmin,
      accentColorAdmin,
      showLoginDialog,
      showResetPasswordDialog,
      tab,
      tabs,
      loginFormValid,
      name,
      surname,
      email,
      userName,
      password,
      verify,
      loginPassword,
      loginEmail,
      emailRules,
      show1,
      rules,
      passwordMatch,
      loginForm,
      registerForm,
      login,
      reset,
      resetValidation,
      register,
      loading,
      snackbar,
      animated,
      errMsg,
      errTitle,
      sendResetPasswordCode,
      resetPasswordEmail,
      switchDialogs,
      resetPasswordFormValid,
      registerFormValid,
      showCheckEmailDialog,
      invalidResetEmail,
    }
  },
}
</script>

<style lang="scss" scoped>
.loading {
  min-height: 344px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
