<template>
  <v-dialog v-model="cDialog" persistent max-width="750">
    <v-card>
      <v-card-title class="headline">
        <slot name="headline">
          {{ headline }}
        </slot>
      </v-card-title>
      <v-card-text>
        <slot>
          {{ message }}
        </slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="red darken-1" text @click="decide(false)">
          Cancel
        </v-btn>
        <v-btn color="green darken-1" text @click="decide(true)">
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from '@vue/composition-api'

export default {
  name: 'ConfirmDialog',
  props: {
    dialog: { default: false, type: Boolean },
    activatorClass: { default: '.activator', type: String },
    headline: { default: '', type: String },
    message: { default: '', type: String },
  },
  setup() {
    const cDialog = ref(false)
    let resolve
    const decide = agree => {
      cDialog.value = false
      resolve(agree)
    }
    const open = () => {
      cDialog.value = true
      return new Promise((res, reject) => {
        resolve = res
      })
    }

    return { decide, cDialog, open }
  },
}
</script>

<style lang="scss" scoped></style>
