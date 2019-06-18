<template>
  <blockquote class="quote">
    <AmpSectionHeader class="mt-0" title="HERALD" :light="true"/>
    <p>{{quote}}</p>
    <footer rel="author">{{author}}</footer>
  </blockquote>
</template>
<script>
  import AmpSectionHeader   from '~/components/amp/AmpSectionHeaderH3'
  export default {
    name: 'AmpQuote',
    props:['quote','author'],
    components:{AmpSectionHeader}
  }

</script>
<style>
  .quote{
    position: absolute;
    margin: auto;
    left:10%;
    right:10%;
    top: 0;
    bottom:-20px;
    display:flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
    .quote h3{
    display:none;
  }
  .quote p {
    color:white;
    font-family: 'Roboto Slab', serif;
    font-size: 1em;
    font-weight: 300;
    line-height: 1.2em;
    padding: 0 8% 0 8%;
    text-align: center;
  }
  .quote footer {
    color:white;
    text-transform: uppercase;
    font-size: .8;
    font-weight: 700;
    letter-spacing: 0.1em;
  }

  @media screen and (min-width: 648px) {
  .quote{
    position: absolute;
    left:10%;
    right:10%;
    top: -10%;
    bottom:0;
    display:flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
    .quote h3{
    display:block;
  }
    .quote p {
      color:white;
      font-family: 'Roboto Slab', serif;
      font-size: 1.6em;
      font-weight: 300;
      line-height: 2em;
    }
    .quote footer {
      color:white;
      text-transform: uppercase;
      font-size: 1.6;
      font-weight: 700;
      letter-spacing: 0.1em;
    }
  }

</style>