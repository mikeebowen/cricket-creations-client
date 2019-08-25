<template>
  <div class="main-wrapper">
    <div id="stars1"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>
    <div class="home-container pt-4">
      <h1>Cricket Creations</h1>
    </div>
    <div class="home-container">
      <img src="@/assets/images/grasshopper-black.png" alt="grasshopper" class="mt-sm-5">
    </div>
    <div class="home-container mt-5">
      <h2 class="mr-sm-2 mr-md-3 mr-lg-5">
        <span>{</span>
        <router-link to="/projects" class="mx-1 homepage-link">Projects</router-link>
        <span>}</span>
      </h2>
      <h2 class="mx-sm-2 mx-md-3 mx-lg-5">
        <span>{</span>
        <router-link to="/blog" class="mx-1 homepage-link">Blog</router-link>
        <span>}</span>
      </h2>
      <h2 class="ml-sm-2 ml-md-3 ml-lg-5">
        <span>{</span>
        <router-link to="/about" class="mx-1 homepage-link">About</router-link>
        <span>}</span>
      </h2>
    </div>
    <div class="home-container">
      <hr>
    </div>
    <ExplodingParticles ref="particles" v-show="showParticles" />
  </div>
</template>

<script>
import ExplodingParticles from '@/components/ExplodingParticles.vue';

export default {
  name: 'home',
  components: {ExplodingParticles},
  data () {
    return {
      showParticles: false,
    };
  },
  mounted () {
    const body = document.querySelectorAll('body')[0];
    body.addEventListener('mousedown', this.toggleStarBurst);
    body.addEventListener('mouseup', this.toggleStarBurst);
    body.setAttribute('style', 'overflow-y: hidden !important; overflow-x: hidden !important');
  },
  beforeDestroy () {
    const body = document.querySelectorAll('body')[0];
    body.removeEventListener('mousedown', this.toggleStarBurst);
    body.removeEventListener('mouseup', this.toggleStarBurst);
    body.removeAttribute('style');
  },
  methods: {
    toggleStarBurst (e) {
      if (!Array.prototype.includes.call(e.target.classList, 'homepage-link')) {
        this.$refs.particles.$el.style.left = `${e.clientX}px`;
        this.$refs.particles.$el.style.top = `${e.clientY}px`;
        if (this.showParticles) {
          setTimeout(() => {
            this.showParticles = !this.showParticles;
          }, 300);
        } else {
          this.showParticles = !this.showParticles;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/variables.scss";

.main-wrapper {
  overflow: hidden !important;
  height: 100%;
  width: 100%;
}

.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;

  h1,
  .attribute {
    font-family: "Bevan", cursive;
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

// star background
// n is number of stars required
@function multiple-box-shadow($n) {
  $value: "#{random(2000)}px #{random(2000)}px #{$bodyBackgroundColor}";
  @for $i from 2 through $n {
    $value: "#{$value} , #{random(2000)}px #{random(2000)}px #{$bodyBackgroundColor}";
  }

  @return unquote($value);
}

$shadows-small: multiple-box-shadow(7000);
$shadows-medium: multiple-box-shadow(2000);
$shadows-big: multiple-box-shadow(1000);

@mixin boxShaddow($val) {
  @if $val == 1 {
    box-shadow: $shadows-small;
  }
  @if $val == 2 {
    box-shadow: $shadows-medium;
  }
  @if $val == 3 {
    box-shadow: $shadows-big;
  }
}

@for $i from 1 to 3 {
  #stars#{$i} {
    height: #{$i}px;
    width: #{$i}px;
    background: transparent;
    @include boxShaddow($i);
    animation: animStar #{$i * 50}s linear infinite;

    &::after {
      content: " ";
      position: absolute;
      height: #{$i}px;
      width: #{$i}px;
      background: transparent;
      @include boxShaddow($i);
    }
  }
}

@keyframes animStar {
  from {
    transform: translateY(0px);
  }

  to {
    transform: translateY(-2000px);
  }
}
//////////////////////////////////////////

@media screen and (max-width: $smBreakPoint) {
  .home-container {
    h1 {
      margin: 2rem;
      text-align: center;
    }
  }
}
</style>
