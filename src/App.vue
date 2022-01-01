<template>
  <v-app id="app">
    <router-view name="header" />
    <router-view name="adminHeader" />
    <v-main>
      <router-view :key="$route.fullPath" />
    </v-main>
    <router-view name="footer" />
  </v-app>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss">
@import '@/styles.scss';

#app {
}
</style>
