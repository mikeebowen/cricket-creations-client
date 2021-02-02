<template>
  <v-dialog v-model="cDialog" persistent max-width="290">
    <v-card>
      <v-card-title class="headline"> Are you sure you want to delete {{ selectedName }}? </v-card-title>
      <v-card-text>
        This will be super annoying to undo...
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
import { ref, watch } from '@vue/composition-api'

export default {
  name: 'DeleteDialog',
  props: {
    dialog: { default: false, type: Boolean },
    activatorClass: { default: '.activator', type: String },
    selectedName: { default: '', type: String },
  },
  setup(props, { emit, set }) {
    const cDialog = ref(false)
    const decide = agree => {
      cDialog.value = false
      emit('submit', agree)
    }
    watch(
      () => props.dialog,
      (cur, prev) => {
        cDialog.value = cur
      },
    )

    return { decide, cDialog }
  },
}
</script>

<style lang="scss" scoped></style>
