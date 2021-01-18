<template>
  <v-expansion-panels flat>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <p class="grey--text text--darken-2 text-h5">Tags</p>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-btn depressed small class="grey--text text--darken-3" @click="dialog = true">
          <v-icon v-text="'mdi-tag-plus-outline'" />
        </v-btn>
        <v-chip-group>
          <v-chip v-for="(tag, i) in tags" :key="tag.id" close @click:close="removeTag(i)">{{ tag.name }}</v-chip>
        </v-chip-group>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-actions>
          <v-btn depressed small class="grey--text text--darken-3" @click="dialog = false">
            <v-icon v-text="'mdi-close'" />
          </v-btn>
        </v-card-actions>
        <v-card-title>Create Tag</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newTagName"
            label="Tag Name"
            append-outer-icon="mdi-plus-box-outline"
            @click:append-outer="updateTags({ name: newTagName })"
          />
          <v-expansion-panels flat>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <p class="grey--text text--darken-2 text-h5">Existing Tags</p>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-chip-group column>
                  <v-chip v-for="tag in existingTags" :key="tag.id" @click="updateTags(tag)">
                    {{ tag.name }}
                    <v-icon>mdi-check-circle-outline</v-icon>
                  </v-chip>
                </v-chip-group>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-expansion-panels>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from '@vue/composition-api'
export default {
  props: {
    tags: { type: Array, default: () => [] },
  },
  emits: ['new-tags'],
  setup(props) {
    const existingTags = ref([])
    const newTagName = ref('')
    const dialog = ref(false)

    onMounted(async () => {
      {
        const dbTags = await axios.get('/api/tag')
        existingTags.value.push(...dbTags?.data?.data)
      }
    })
    return { newTagName, dialog, existingTags }
  },
  methods: {
    updateTags(tag) {
      this.tags.push(tag)
      this.newTagName = ''
      this.$emit('new-tags', this.tags)
    },
    removeTag(index) {
      this.tags.splice(index, 1)
      this.$emit('new-tags', this.tags)
    },
  },
}
</script>

<style></style>
