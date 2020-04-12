<template>
  <v-footer
    tile
    width="100%"
    color="#f8f8ff"
  >
    <v-row>
      <v-col
        class="text-center pa-0"
        cols="12"
      >
        <v-btn
          text
          href="https://github.com/mikeebowen"
        >
          <v-icon v-text="'fab fa-github'" />
        </v-btn>
        <v-btn
          text
          href="https://www.linkedin.com/in/michaelbowen1/"
        >
          <v-icon v-text="'fab fa-linkedin'" />
        </v-btn>
        <v-btn
          text
          href="https://stackoverflow.com/users/5045467/cascadiajs"
        >
          <v-icon v-text="'fab fa-stack-overflow'" />
        </v-btn>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: 'FooterComponent',
}
</script>
