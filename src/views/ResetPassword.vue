<template>
  <span>
    <v-dialog v-model="resetDialog" persistent max-width="600px" min-width="360px">
      <v-card>
        <v-card-title> Reset Password </v-card-title>
        <v-card-text v-if="!loggedIn">
          <v-row>
            <v-col cols="12"> Enter the code you received in your email</v-col>
          </v-row>
          <v-form v-model="resetForm">
            <v-row class="px-4">
              <v-col cols="12">
                <v-text-field v-model="resetPasswordCode" type="text" label="Code" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="2" :class="{ 'd-flex': $vuetify.breakpoint.xs, 'justify-center': $vuetify.breakpoint.xs }">
                <v-btn x-large :disabled="!resetPasswordCode.length" color="primary" align-end @click="resetPassword">Reset</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-text v-else>
          <v-row>
            <v-col>
              <v-skeleton-loader v-if="loading" class="mt-5 mx-10" type="list-item, list-item" />
              <v-form v-else>
                <v-row class="px-4">
                  <v-col>
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
                      :rules="[rules.required, rules.passwordMatch]"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      label="Confirm Password"
                      counter
                      @click:append="show1 = !show1"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="11" class="d-flex justify-end">
              <v-btn tile :disabled="password !== verify || password.length > 8" @click="updatePassword">Update</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
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
  </span>
</template>

<script>
import store from '../store/store'

export default {
  name: 'ResetPassword',
  data() {
    return {
      resetDialog: true,
      resetForm: null,
      resetPasswordFormValid: false,
      resetPasswordCode: '',
      loggedIn: false,
      show: false,
      show1: false,
      password: '',
      verify: '',
      rules: {
        required: n => !!n || 'Required',
        min: n => n.length >= 8 || 'Password must be at least 8 characters',
        maxLength: n => n.length <= 200 || 'Max length 200 characters',
        passwordMatch: () => this.password === this.verify || 'Password must match',
      },
      loading: false,
      snackbar: false,
      errors: [],
    }
  },
  methods: {
    async resetPassword() {
      await store.dispatch('user/loginWithResetToken', { resetCode: this.resetPasswordCode, id: this.$route.params.id })
      const user = store.state?.user?.user

      if (user) {
        this.loggedIn = true
      }
    },
    async updatePassword() {
      try {
        await store.dispatch('user/updatePassword', this.password)
        await store.dispatch('user/logout')
        await this.$router.push({ name: 'login' })
      } catch (err) {
        this.errors = Object.entries(err?.response?.data?.errors) || [err?.message] || [err]
        this.snackbar = true
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
