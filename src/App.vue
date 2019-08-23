<template>
  <v-app id="app">
    <v-app-bar app>
      <router-view name="headerComponent" />
    </v-app-bar>
    <v-content app>
      <v-container fill-height>
        <router-view/>
      </v-container>
    </v-content>
    <v-footer app>
      <FooterComponent />
    </v-footer>
  </v-app>
</template>

<script>
import FooterComponent from '@/components/Footer.vue';

export default {
  name: 'app',
  components: {
    FooterComponent,
  },
  mounted () {

  },
};
</script>


<style lang="scss">
  @import "@/styles.scss";

  #app {
    height: 100%;
  }

  .container {
    height: 100%;
  }
</style>
