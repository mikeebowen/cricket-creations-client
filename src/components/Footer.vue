<template>
  <v-footer :app="isHome" padless class="justify-center white py-2">
    <v-btn v-for="icon in icons" :key="icon.link" :href="icon.link" class="mx-4" icon text>
      <v-icon size="36px">
        {{ icon.icon }}
      </v-icon>
    </v-btn>
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
  },
}
</script>

<style lang="scss" scoped>
@import '@/variables.scss';

.footer {
  background-color: $white;
}
</style>
