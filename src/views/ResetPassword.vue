<template>
  <v-dialog v-model="resetDialog" persistent max-width="600px" min-width="360px">
    <v-card>
      <v-card-title> Reset Password </v-card-title>
      <v-card-text>
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
    </v-card>
  </v-dialog>
</template>

<script>
// import { ref } from '@vue/composition-api'

export default {
  name: 'ResetPassword',
  data() {
    return {
      resetDialog: true,
      resetForm: null,
      resetPasswordFormValid: false,
      resetPasswordCode: '',
    }
  },
  methods: {
    resetPassword() {},
  },
}
</script>

<style lang="scss" scoped></style>
