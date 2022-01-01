<template>
  <v-container class="d-flex align-center not-found">
    <v-row>
      <v-col class="text-center">
        <h1>That page doesn't exist!</h1>
        <h2>Sorry, the page your were looking for could not be found</h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'FourOFour',
}
</script>

<style lang="scss" scoped>
.not-found {
  height: 100%;
}
</style>
