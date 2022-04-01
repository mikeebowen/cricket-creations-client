<template>
  <v-footer :app="isHome" padless class="white flex-column">
    <v-row>
      <v-col class="d-flex justify-center">
        <v-btn v-for="icon in icons" :key="icon.link" :href="icon.link" class="mx-4" icon text>
          <v-icon size="36px">
            {{ icon.icon }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-1 pb-4 footer-text">
        <v-icon>mdi-copyright</v-icon>
        {{ copyRightMessage }}
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  data() {
    return {
      icons: [
        { icon: 'fab fa-github', link: 'https://github.com/mikeebowen' },
        { icon: 'fab fa-linkedin', link: 'https://www.linkedin.com/in/michaelbowen1/' },
        { icon: 'fab fa-stack-overflow', link: 'https://stackoverflow.com/users/5045467/cascadiajs' },
      ],
    }
  },
  computed: {
    isHome() {
      return this.$route.name === 'home'
    },
    copyRightMessage() {
      const year = new Date().getFullYear()

      if (year === 2022) {
        return ' 2022 Michael Bowen'
      } else {
        return ` 2022 - ${year} Michael Bowen`
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/variables.scss';

.footer {
  background-color: $white;
}

.footer-text {
  font-size: 1rem;
  color: $medium-gray;
}
</style>
