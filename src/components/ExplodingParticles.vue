<template>
  <div id="wrap">
    <div class="box" v-for="i in 50" :key="i"></div>
  </div>
</template>

<script>
export default {
  name: 'ExplodingParticles',
};
</script>

<style lang="scss" scoped>
$boxes: 50;

#wrap{
  position: absolute;
}

div.box{
  width: 5px;
  height: 5px;
  border-radius: 50%;
  position: absolute;
  user-select: none;
}

@for $i from 1 through $boxes {
  @keyframes anim-#{$i} {
    0% {
      top: 50%;
      left: 50%;
    }
    50%{
      top: random(1000) - 500 + px;
      left: random(1000) - 500 + px;
    }
    100% {
      top: 50%;
      left: 50%;
    }
  }

    div.box{
      &:nth-child(#{$i}){
        left: $i * 10px;
        animation-duration: 2.6s;
        animation-name: anim-#{$i};
        animation-iteration-count: infinite;
        animation-direction: alternate;
        animation-timing-function: ease-in-out;
        background: hsla(10 * $i, 100%, 50%, 1);
      }
    }
}
</style>
