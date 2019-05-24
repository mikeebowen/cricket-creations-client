<template>
  <div id="app">
    <router-view name="headerComponent" />
    <b-container>
      <router-view/>
    </b-container>
    <FooterComponent />
  </div>
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
