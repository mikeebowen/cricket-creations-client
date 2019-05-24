<template>
  <div class="footer-wrapper">
    <footer class="footer-container fixed-bottom d-flex justify-content-center align-content-center align-items-center w-100">
      <div class="site-author mr-5">by Michael Bowen</div>
      <a href="https://github.com/mikeebowen" class="mr-5"><font-awesome-icon :icon="['fab', 'github']" size="2x" /></a>
      <a href="https://www.linkedin.com/in/michaelbowen1/" class="mr-5"><font-awesome-icon :icon="['fab', 'linkedin']" size="2x" /></a>
      <a href="https://stackoverflow.com/users/5045467/cascadiajs"><font-awesome-icon :icon="['fab', 'stack-overflow']" size="2x" /></a>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'footer-component',
};
</script>

<style lang="scss" scoped>
  @import "@/variables.scss";

  footer {
    padding: .5rem 0;

    &.footer-container {
      a {
        color: $defaultFontColor;
      }
    }
  }
</style>
