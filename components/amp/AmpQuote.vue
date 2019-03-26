<template>
  <div class="quote">
    <p>{{quote}}</p>

    <span>{{author}}</span>
  </div>
</template>
<script>

  export default {
    name: 'AmpQuote',
    props:['quote','author']
  }

</script>
<style>
.quote{
  position: absolute;
  left:17%;
  top: 25%;
  width:65%;
}
.quote p {
  color:white;
  font-family: 'Roboto Slab', serif;
  font-weight: lighter;
  font-size: .8em;
}
.quote span {
  color:white;
  text-transform: uppercase;
  font-size: .6em;
}
@media screen and (min-width: 650px) {
  .quote{
    position: absolute;
    left:17%;
    top: 25%;
    width:65%;
  }
  .quote p {
    color:white;
    font-family: 'Roboto Slab', serif;
    font-weight: lighter;
    font-size: 1em;
  }
  .quote span {
    color:white;
    text-transform: uppercase;
    font-size: .8em;
  }
}
</style>