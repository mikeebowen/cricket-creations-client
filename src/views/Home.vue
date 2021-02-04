<template>
  <span class="content-wrapper">
    <div v-for="i in 4" :id="`stars${i}`" :key="i" />
    <v-container class="main-wrapper d-flex flex-column justify-space-around">
      <div class="home-container pt-4 align-start">
        <h1 class="text-center">
          Cricket Creations
        </h1>
      </div>
      <div class="home-container">
        <img src="@/assets/images/grasshopper-black.png" alt="grasshopper" />
      </div>
      <div class="home-container mt-5">
        <v-btn v-for="(page, i) in pages" :key="i" text x-large top :to="`${page.link}`" class="homepage-link">
          <span class="pr-1">{</span>
          {{ page.name }}
          <span class="pl-1">}</span>
        </v-btn>
      </div>
      <ExplodingParticles v-show="showParticles" ref="particles" />
    </v-container>
  </span>
</template>

<script>
import ExplodingParticles from '@/components/ExplodingParticles.vue'

export default {
  name: 'Home',
  components: { ExplodingParticles },
  data() {
    return {
      showParticles: false,
      pages: [
        { name: 'Projects', link: '/projects' },
        { name: 'Musings', link: '/musings' },
        { name: 'About', link: '/about' },
      ],
    }
  },
  mounted() {
    const body = document.querySelectorAll('body')[0]
    body.addEventListener('mousedown', this.toggleStarBurst)
    body.addEventListener('mouseup', this.toggleStarBurst)
    body.setAttribute('style', 'overflow-y: hidden !important; overflow-x: hidden !important')
  },
  beforeDestroy() {
    const body = document.querySelectorAll('body')[0]
    body.removeEventListener('mousedown', this.toggleStarBurst)
    body.removeEventListener('mouseup', this.toggleStarBurst)
    body.removeAttribute('style')
  },
  methods: {
    toggleStarBurst(e) {
      if (Array.prototype.every.call(e.target.classList, c => c !== 'homepage-link' && c !== 'v-btn__content')) {
        this.$refs.particles.$el.style.left = `${e.clientX}px`
        this.$refs.particles.$el.style.top = `${e.clientY}px`
        if (this.showParticles) {
          setTimeout(() => {
            this.showParticles = !this.showParticles
          }, 300)
        } else {
          this.showParticles = !this.showParticles
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/variables.scss';

.content-wrapper {
  background-color: $body-background-color;
  height: 100vh;
}

.main-wrapper {
  overflow: hidden !important;
  height: 100%;
  width: 100%;

  &::v-deep .v-btn__content {
    align-items: baseline;
  }
}

.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;

  h1,
  .attribute {
    font-family: 'Bevan', cursive;
    font-size: 4.8rem;
  }

  .homepage-link {
    span {
      visibility: hidden;
      font-size: 1.25rem;
    }

    &:hover,
    &:focus {
      span {
        visibility: visible;
      }
    }

    a {
      color: $primary-text-color-admin;
      text-decoration: none;
    }
  }

  img {
    max-height: 300px;
  }
}

// star background
// n is number of stars required
@function multiple-box-shadow($n) {
  $value: '#{random(2000)}px #{random(2000)}px #{$body-background-color}';
  @for $i from 2 through $n {
    $value: '#{$value} , #{random(2000)}px #{random(2000)}px #{$body-background-color}';
  }

  @return unquote($value);
}

$shadows-small: multiple-box-shadow(7000);
$shadows-medium: multiple-box-shadow(2000);
$shadows-big: multiple-box-shadow(1000);
$shadows-xl: multiple-box-shadow(500);

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
  @if $val == 4 {
    box-shadow: $shadows-xl;
  }
}

@for $i from 1 to 4 {
  #stars#{$i} {
    height: #{$i}px;
    width: #{$i}px;
    background: transparent;
    @include boxShaddow($i);
    animation: animStar #{$i * 50}s linear infinite;

    &::after {
      content: ' ';
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

@media screen and (max-width: $md-break-point) {
  .home-container {
    h1 {
      font-size: 3.8rem;
    }

    img {
      max-width: 350px;
    }
  }
}

@media screen and (max-width: $sm-break-point) {
  .main-wrapper {
    &::v-deep .v-btn:not(.v-btn--round).v-size--x-large {
      padding-right: 0;
    }
  }

  .home-container {
    h1 {
      font-size: 2.8rem;
    }

    img {
      max-height: 150px;
    }
  }
}
</style>
