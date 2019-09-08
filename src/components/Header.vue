<template>
  <v-app-bar app flat color="#f8f8ff" absolute hide-on-scroll>
    <v-btn text to="/">
      <v-img src="@/assets/images/grasshopper-black.png" max-height="50px" max-width="50px" to="/" />
      <v-toolbar-title class="title">Cricket Creations</v-toolbar-title>
    </v-btn>
    <div class="flex-grow-1"></div>
    <v-toolbar-items>
      <v-btn text to="/projects">Projects</v-btn>
      <v-btn text to="/blog">Blog</v-btn>
      <v-btn text to="/about">About</v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Header',
};
</script>

<style lang="scss" scoped>
  .header {
    .title {
      font-family: "Bevan", cursive !important;
      text-transform: initial;
    }
  }
</style>
