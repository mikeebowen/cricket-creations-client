<template>
  <div>Hello World Foo</div>
</template>

<script>
// import {ref} from '@vue/composition-api'
// import axios from 'axios'
export default {
  name: 'TagSearch',
  mounted() {
    console.log('params', this.$route.params)
  },
}
</script>

<style lang="scss" scoped></style>
