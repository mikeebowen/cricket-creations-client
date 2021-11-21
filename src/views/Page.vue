<template>
  <v-container class="d-flex flex-column page container">
    <v-row class="flex-grow-0">
      <v-col>
        <h1 class="text-center">{{ page.title }}</h1>
        <div class="decorative-line">
          <div class="decorative-line-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16.395" height="20.284" viewBox="0 0 16.395 20.284">
              <g id="Group_197" data-name="Group 197" transform="translate(-689.803 -586.663)">
                <rect
                  id="Rectangle_362"
                  data-name="Rectangle 362"
                  width="7"
                  height="13"
                  transform="translate(692.403 591.991) rotate(-21)"
                  fill="#fff"
                />
                <rect
                  id="Rectangle_198"
                  data-name="Rectangle 198"
                  width="0.999"
                  height="19.965"
                  transform="translate(690.449 587.668) rotate(-21.05)"
                  stroke="#000"
                  stroke-width="1"
                />
                <rect
                  id="Rectangle_199"
                  data-name="Rectangle 199"
                  width="0.999"
                  height="19.965"
                  transform="translate(697.448 587.668) rotate(-21.05)"
                  stroke="#000"
                  stroke-width="1"
                />
              </g>
            </svg>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex flex-column">
        <v-sheet elevation="2" class="flex-grow-1 px-12 pt-6" v-html="page.content" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from '@/store/store'
export default {
  data() {
    return { page: null }
  },
  watch: {
    $route(to, from) {
      this.getPage()
    },
  },
  beforeMount() {
    this.getPage()
  },
  methods: {
    getPage() {
      let included = false
      for (const page of store.state.page.pages) {
        if (page.heading === this.$route.params.heading) {
          this.page = page
          included = true
        }
      }

      if (!included) {
        // TODO: navigate to 404 here
        this.page = null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
}

.container {
  max-width: 1000px;
}

.decorative-line {
  border-top: 2px solid #000;
  height: 13px;
  margin-top: 8px;
  margin-bottom: 25px;
  text-align: center;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;

  .decorative-line-center {
    position: relative;
    top: -18px;
  }
}
</style>
