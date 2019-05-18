<template>
  <div class="main-wrapper">
    <div id='stars'></div>
    <div id='stars2'></div>
    <div id='stars3'></div>
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

  // star background
    // n is number of stars required
@function multiple-box-shadow ($n) {
  $value: '#{random(2000)}px #{random(2000)}px #{$bodyBackgroundColor}';
  @for $i from 2 through $n {
    $value: '#{$value} , #{random(2000)}px #{random(2000)}px #{$bodyBackgroundColor}';
  }

  @return unquote($value);
}

$shadows-small:  multiple-box-shadow(700);
$shadows-medium: multiple-box-shadow(200);
$shadows-big:    multiple-box-shadow(100);

html{
  height: 100%;
  background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
  overflow: hidden;
}

#stars {
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: $shadows-small;
  animation: animStar 50s linear infinite;

    &:after {
      content: " ";
      position: absolute;
      top: 2000px;
      width: 1px;
      height: 1px;
      background: transparent;
      box-shadow: $shadows-small;
    }
}


#stars2 {
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: $shadows-medium;
  animation: animStar 100s linear infinite;

  &:after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: $shadows-medium;
  }
}

#stars3 {
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: $shadows-big;
  animation: animStar 150s linear infinite;

  &:after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: $shadows-big;
  }
}

@keyframes animStar {
  from {
    transform: translateY(0px)
  }

  to {
    transform: translateY(-2000px)
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
