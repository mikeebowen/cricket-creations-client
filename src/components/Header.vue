<template>
  <b-navbar toggleable="md" variant="dark" type="dark" fixed="true" >
    <b-navbar-brand>
      <router-link class="cricket-logo home-link" to="/" >
        <img src="@/assets/images/grasshopper-white.png" class="d-inline-block align-top" alt="grasshopper">
      </router-link>
    </b-navbar-brand>
    <b-navbar-toggle target="headerNavBar"></b-navbar-toggle>
    <b-collapse id="headerNavBar" is-nav>
      <b-navbar-nav>
        <b-nav-item>
          <router-link class="nav-link home-link" to="/" >
            Home
          </router-link>
        </b-nav-item>
        <b-nav-item>
          <router-link class="nav-link" to="/projects">
            Projects
          </router-link>
        </b-nav-item>
        <b-nav-item>
          <router-link class="nav-link" to="/blog" >
            Blog
          </router-link>
        </b-nav-item>
        <b-nav-item>
          <router-link class="nav-link" to="/about" >
            About
          </router-link>
        </b-nav-item>
      </b-navbar-nav>
      <ul class="navbar-nav">

      </ul>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'header-component',
};
</script>

<style lang="scss" scoped>
  @import "@/variables.scss";
  @import "../../node_modules/bootstrap/scss/bootstrap.scss";

  :host {
    position: fixed;
    top: 0;
    width: 100%;
  }

  #headerNavBar {
    a {
      font-size: 2.4rem;
    }
  }

  .cricket-logo {
    img {
      height: 50px;
    }
  }

  .router-link-active {
    &:not(.home-link) {
      @extend .active;
    }
  }

  @media screen and (max-width: $medBreakPoint) {
    .cricket-logo {
      img {
        height: 30px;
      }
    }
  }
</style>
