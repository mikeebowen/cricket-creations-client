<template>
  <v-app id="app">
    <router-view name="appBar" />
    <router-view />
    <router-view name="footer"></router-view>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>


<style lang="scss">
  @import "@/styles.scss";

  #app {
  }
</style>
