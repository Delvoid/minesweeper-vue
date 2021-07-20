<template>
  <section>
    <h1 class="text-white text-4xl pb-4">MineSweeper</h1>
    <Grid />
  </section>
  <footer>
    <h3 class="text-white text-sm pt-6">Created by Delvoid using Vue Js</h3>
  </footer>
</template>

<script>
  import Grid from '../components/Grid.vue'
  export default {
    components: {
      Grid,
    },
    setup() {
      return {}
    },
  }
</script>

<style lang="scss" scoped></style>
