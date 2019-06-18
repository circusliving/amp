<template>
  <section >
    <div class="quotes">

      <div class="parallax-image-window-float">
        <div class="parallax-image-window">
          <amp-img amp-fx="parallax" data-parallax-factor="1.15" class="cover" alt="houlagin clowns in a row" src="https://images.circusliving.com/CircusLivingParallax.jpg" layout="fill" ></amp-img>
        </div> 
      </div> 

      <amp-carousel type="slides" class="caro"
        height="350"
        media="(min-width: 648px)"
        controls
        loop
        autoplay
        data-next-button-aria-label="Go to next slide"
        data-previous-button-aria-label="Go to previous slide">
        <div>
          <slot name="quoteOne"/>
        </div>
        <div>
          <slot name="quoteTwo"/>
        </div>
        <div>
          <slot name="quoteThree"/>
        </div>
      </amp-carousel>

<!-- <amp-img  media="(max-width: 649px)" amp-fx="parallax" alt="clowns in a row" data-parallax-factor="1.05"  height="200" layout="fixed-height" src="https://images.circusliving.com/500x200/CircusLivingParallax.min.jpg"></amp-img>    
      <amp-carousel type="slides" class="caro"
        media="(max-width: 649px)"
      
        height="160"
        controls="true"
        loop
        data-next-button-aria-label="Go to next slide"
        data-previous-button-aria-label="Go to previous slide">
        <div>
          <slot name="quoteOne"/>
        </div>
        <div>
          <slot name="quoteTwo"/>
        </div>
        <div>
          <slot name="quoteThree"/>
        </div>
      </amp-carousel> -->

    </div>
  </section>
</template>

<script>
  import Quote from '~/components/amp/AmpQuote.vue'
  export default {
    name: 'AmpQuotes'
  }
</script>

<style >
  .parallax-image-window amp-img { margin: 0 0 -20% 0; }
  .cover > img { object-fit: cover; }
</style>

<style scoped>

  .quotes{ min-width: 350px; position: relative; overflow: hidden; }
  .parallax-image-window-float { position:absolute; top:0; bottom:0; left:0; right:0; }
  .parallax-image-window { overflow: hidden-x; position: relative; min-height: 350px; }
  .caro{ z-index:99; }
  .parallax-image-window amp-carousel{ margin:auto; position:fixed; top:0; bottom:0; left:0; right:0; }

  @media screen and (min-width: 648px) {
    .parallax-image-window amp-carousel{ margin-right:20%; margin-left:20%; }
  }
</style>