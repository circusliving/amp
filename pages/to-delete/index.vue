<template>
  <section >

    <div class="amp-page-hero "></div>
    <div class="text-section">
      <h2>Greetings Friend</h2>
      We've been eagerly awaiting your arrival.<br/>
      Fate has delivered you to us at our entreat.<br/>
      Rest assured your visit has not come unnoticed.<br/>
      There is no need to tread lightly.<br/>
      We welcome your kind.<br/>
      Banal normalcy is far from the norm here.

      <h3>...welcome to Circus Living.</h3>
    </div>

    <AmpSectionHeader title="SIDESHOWS"/>

    <AmpThreeCards>
      <AmpCard
        slot="first"
        title="Mysterious Monster Marvels"
        subTitle="Legendary Creatures. Curious Cryptids. Mythical Beasts"
        description="“And above all, watch with glittering eyes the whole world around you because the greatest secrets are always hidden in the most unlikely places. Those who don't believe in magic will never find it.” ― Roald Dahl"
        image="https://images.circusliving.com/338x222/mysteriousmonstermarvels.jpg"
        link="/amp/sideshows/mysterious-monster-marvels"
      />
      <AmpCard
        slot="second"
        title="Cabinet of Curiosities"
        subTitle="'Macabre' Artists. Gothic Works. Steampunk Creations"
        description="“A painter should begin every canvas with a wash of black, because all things in nature are dark except where exposed by the light.” ― Leonardo da Vinci"
        image="https://images.circusliving.com/338x222/cabinetofcuriosities.jpg"
        link="/amp/sideshows/cabinet-of-curiosities"
      />
      <AmpCard
        slot="third"
        title="Magical and Mystical Experiences"
        subTitle="Enchanting Experiences, Ethereal Places Celestial Reflections"
        description="“Pleasure to me is wonder—the unexplored, the unexpected, the thing that is hidden and the changeless thing that lurks behind superficial mutability.” ― H.P. Lovecraft"
        image="https://images.circusliving.com/338x222/magicalmysticalexp.jpg"
        link="/amp/sideshows/magical-mystical-experiences"
      />
      </AmpThreeCards>

      <br/>
      <AmpQuotes>

        <AmpQuote
          quote=" I have always dreamed of lifting the veil of this world to expose another, one parallel to ours which we have all probably sensed at some point yet been unable to see clearly."
          author="Nicole Watt of Mahlimae"
          slot="quoteOne"
        />
        <AmpQuote
          quote="Many people are scared or intrigued by monster stories even if they don't believe they are true. It's easy to be skeptical when you're home in your living room but it's a lot harder when you're out in the woods at night."
          author="Peter Muise"
          slot="quoteTwo"
        />
        <AmpQuote
          quote="I'm constantly motivated and inspired by the human condition. Those with afflictions or abnormalities, for lack of a better word are infinitely more interesting than the rest of us."
          author="Colleen Downs of Dolldrums"
          slot="quoteThree"
        />
        <AmpQuote
          quote="... Mister Bain, always replete with bright-eyed innocence and unabashed goodness, begged to pet some of the unsullied creatures on display."
          author="Review of 'Bodyworlds: Animal Inside Out Exhibit'"
          slot="quoteFour"
        />
      </AmpQuotes>
      <br/>

      <AmpSectionHeader title="(A Pass) From the Wagon"/>
      <AmpThreeCards>
        <AmpCardImgMiddle
          slot="first"
          title="Bodyworlds: Animal Inside Out Exhibit"
          subTitle="01.02.2017 Spookshows"
          description="What is it about death and its perceived connection with a being’s physical form that influences how one reacts to corpses on display?"
          image="https://images.circusliving.com/338x222/animalinsideout.jpg"
          link="/amp/post/body-worlds-animal-inside-out"
        />
        <AmpCardImgMiddle
          slot="second"
          title="Chocolate Maple Frogs"
          subTitle="03.18.2017 kiarrasfinds, ghoulishgrubs"
          description="Perfect for Harry Potter and Halloween themed get-togethers, 6 year old Kiarra made some chocolate maple frogs!"
          image="https://images.circusliving.com/375x222/chocolatemaplefrogs3.jpg"
          link="/amp/post/kiarras-finds-chocolate-maple-frogs"
        />
        <AmpCardImgMiddle
          slot="third"
          title="Mahlimae"
          subTitle="05.06.2015 cabinetofcuriosities,macabreartist"
          description="An Interview with Nicole Watt. The power of simplicity, understanding mankind's darkness and light, and the wild unknown."
          image="https://images.circusliving.com/338x222/mahlimaethumbnail.jpg"
          link="/amp/post/mahlimae-an-interview-with-nicole-watt"
        />
        </AmpThreeCards>

    <!-- </div> -->
  </section>
</template>

<script>
  import AmpSectionHeader   from '~/components/amp/AmpSectionHeader'
  import AmpThreeCards      from '~/components/amp/ThreeCards'
  import AmpCard            from '~/components/amp/CardCL'
  import AmpCardImgMiddle   from '~/components/amp/CardImgMiddle'
  import AmpQuotes          from '~/components/amp/AmpQuotes'
  import AmpQuote           from '~/components/amp/AmpQuote'

  export default {
    name:'index',
    layout:'amp',
    components:{AmpSectionHeader,AmpThreeCards,AmpCard,AmpQuotes,AmpQuote,AmpCardImgMiddle}
  }
</script>
<style>
  .text-section{
    padding: 5em 0 5em 0;
    text-align: center;
  }
</style>
