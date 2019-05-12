<template>
  <div class="main-wrapper">
    <div class="home-container pt-4">
      <h1>Cricket Creations</h1>
    </div>
    <div class="home-container">
      <img src="@/assets/images/grasshopper-black.png" alt="grasshopper" class="mt-sm-5">
    </div>
    <div class="home-container mt-5">
      <h2 class="mr-sm-2 mr-md-3 mr-lg-5">
        <span>{</span>
        <router-link to="/projects" class="mx-1">Projects</router-link>
        <span>}</span>
      </h2>
      <h2 class="mx-sm-2 mx-md-3 mx-lg-5">
        <span>{</span>
        <router-link to="/blog" class="mx-1">Blog</router-link>
        <span>}</span>
      </h2>
      <h2 class="ml-sm-2 ml-md-3 ml-lg-5">
        <span>{</span>
        <router-link to="/about" class="mx-1">About</router-link>
        <span>}</span>
      </h2>
    </div>
    <div class="home-container">
      <hr>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home'
};
</script>

<style lang="scss" scoped>
  @import "@/variables.scss";

  .home-container {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;

    h1,
    .attribute {
      font-family: "Fredericka the Great", cursive;
      font-size: 4.8rem;
    }

    h2 {
      span {
        visibility: hidden;
      }

      &:hover,
      &:focus {
        span {
          visibility: visible;
        }
      }

      a {
        color: $defaultFontColor;
        text-decoration: none;
        vertical-align: middle;
      }
    }

    img {
      max-height: 200px;
    }

    hr {
      width: 80%;
    }

    .fab {
      margin: 0 1rem;
    }
  }

  @media screen and (max-width: $smBreakPoint) {
    .home-container {
      h1 {
        margin: 2rem;
        text-align: center;
      }
    }
  }
</style>
