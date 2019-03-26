<template>
  <section >
    <div class="parallax-image-window" >
      <amp-img amp-fx="parallax" media="(min-width: 650px)" data-parallax-factor="1.1" width="700" height="305" layout="responsive" src="https://images.circusliving.com/CircusLivingParallax.jpg"></amp-img>
      <amp-img amp-fx="parallax" media="(max-width: 649px)" data-parallax-factor="1.1" width="700" height="605" layout="responsive" src="https://images.circusliving.com/CircusLivingParallax.jpg"></amp-img>
      <!-- <h3 class="hidden-md">
        <amp-img src="https://images.circusliving.com/title-decoration.svg" alt="title decoration" width="80" height="10" layout="fixed" ></amp-img>
        Herald
        <amp-img src="https://images.circusliving.com/title-decoration.svg" alt="title decoration" width="80" height="10" layout="fixed" ></amp-img>
      </h3> -->
      <amp-carousel type="slides"
        media="(min-width: 650px)"
        width="650"
        height="200"
        controls
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
      </amp-carousel>
      <amp-carousel type="slides"
        media="(max-width: 649px)"
        width="320"
        height="400"
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
      </amp-carousel>

    </div>
  </section>
</template>
<script>
  export default {
    name: 'AmpQuotes'
  }

</script>
<style scoped>
  .parallax-image-window {
    overflow: hidden;
    position: relative;
  }

  .parallax-image-window > amp-img {
    margin: -10% 0 -10% 0;
  }
  .parallax-image-window amp-carousel{
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    padding: 1.3em 1.3em 1.3em 1.3em;
    text-align: center;
  }
  .parallax-image-window h3{
    position: absolute;
    color: white;
    left:41%;
    top: 1%;
    font-size:1.5em;
  }
</style>