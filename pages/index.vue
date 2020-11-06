<template>
  <section >


    <HeroTitle title=" " :image="coverImage"/>
    <div class="text-section">
      <h1>Greetings Friend</h1>
      We've been eagerly awaiting your arrival.<br/>
      Fate has delivered you to us at our entreat.<br/>
      Rest assured your visit has not come unnoticed.<br/>
      There is no need to tread lightly.<br/>
      We welcome your kind.<br/>
      Banal normalcy is far from the norm here.

      <h2>...welcome to Circus Living.</h2>
    </div>

    <AmpSectionHeader title="SIDESHOWS"/>

    <AmpThreeCards>
      <AmpCard
        slot="first"
        title="Mysterious Monster Marvels"
        subTitle="Legendary Creatures. Curious Cryptids. Mythical Beasts"
        description="“And above all, watch with glittering eyes the whole world around you because the greatest secrets are always hidden in the most unlikely places. Those who don't believe in magic will never find it.” ― Roald Dahl"
        :image="{ src:'https://images.circusliving.com/375x222/mysteriousmonstermarvels.min.jpg', alt:'gold old map', width:375, height:222 }"                 
        link="/side-shows/mysterious-monster-marvels"
      />
      <AmpCard
        slot="second"
        title="Cabinet of Curiosities"
        subTitle="'Macabre' Artists. Gothic Works. Steampunk Creations"
        description="“A painter should begin every canvas with a wash of black, because all things in nature are dark except where exposed by the light.” ― Leonardo da Vinci"
        :image="{ src:'https://images.circusliving.com/375x222/cabinetofcuriosities.min.jpg', alt:'key hole', width:375, height:222 }"          
        link="/side-shows/cabinet-of-curiosities"
      />
      <AmpCard
        slot="third"
        title="Magical and Mystical Experiences"
        subTitle="Enchanting Experiences, Ethereal Places Celestial Reflections"
        description="“Pleasure to me is wonder—the unexplored, the unexpected, the thing that is hidden and the changeless thing that lurks behind superficial mutability.” ― H.P. Lovecraft"
        :image="{ src:'https://images.circusliving.com/375x222/magicalmysticalexp.min.jpg', alt:'light peering through woods', width:375, height:222 }"  
        link="/side-shows/magical-mystical-experiences"
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

      <div class="wagon">
        <CardList  :items="items"  v-if="!widget" />
      </div>
      <!-- <AmpSectionHeader title="(A Pass) From the Wagon"/>
      <AmpThreeCards>
        <AmpCardImgMiddle
          slot="first"
          title="Bodyworlds: Animal Inside Out Exhibit"
          subTitle="01.02.2017 Spookshows"
          description="What is it about death and its perceived connection with a being’s physical form that influences how one reacts to corpses on display?"
          :image="{ src:'https://images.circusliving.com/375x222/animalinsideout.min.jpg', alt:'ostrich inside out', width:375, height:222 }"          
          link="/articles/when-dead-animals-teach"
        />
        <AmpCardImgMiddle
          slot="second"
          title="Chocolate Maple Frogs"
          subTitle="03.18.2017 kiarrasfinds, ghoulishgrubs"
          description="Perfect for Harry Potter and Halloween themed get-togethers, 6 year old Kiarra made some chocolate maple frogs!"
          :image="{ src:'https://images.circusliving.com/375x222/chocolatemaplefrogs3.min.jpg', alt:'Kiarra\'s chocolate frog', width:375, height:222 }"
          link="/articles/chocolate-maple-frogs"
        />
        <AmpCardImgMiddle
          slot="third"
          title="Mahlimae"
          subTitle="05.06.2015 cabinetofcuriosities,macabreartist"
          description="An Interview with Nicole Watt. The power of simplicity, understanding mankind's darkness and light, and the wild unknown."
          :image="{ src:'https://images.circusliving.com/375x222/mahlimaethumbnail.min.jpg', alt:'Mahlimae doll', width:375, height:222 }"
          link="/articles/mahlimae"
        />
        </AmpThreeCards> -->
    
    <!-- </div> -->
  </section>
</template>

<script>
  import path from 'path'
  import webPageMixin       from '~/modules/webPageMixin'

  import HeroTitle          from '~/components/amp/HeroTitle'
  import AmpSectionHeader   from '~/components/amp/AmpSectionHeaderH3'
  import AmpThreeCards      from '~/components/amp/ThreeCards'
  import AmpCard            from '~/components/amp/CardCL'
  // import AmpCardImgMiddle   from '~/components/amp/CardImgMiddle'
  import AmpQuotes          from '~/components/amp/AmpQuotes'
  import AmpQuote           from '~/components/amp/AmpQuote'
  import CardList           from '~/components/amp/CardList'

  export default {
    name:       'index',
    mixins:     [ webPageMixin ],
    head,
    components: { AmpSectionHeader, AmpThreeCards, AmpCard, AmpQuotes, AmpQuote,  HeroTitle, CardList }
  }

  function head () {
    return {
      title: this.alternateName || this.name,
      link: [
    
        { hid: 'canonical'             , rel: 'canonical' , href:  path.normalize(`https://${process.env.BASE_URL}${process.env.BASE_PATH}${this.$route.path}`) },
        { hid: 'stylesheet-roboto-slab', rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto+Slab:300,700'                    },
        { hid: 'stylesheet-roboto'     , rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:400'                             },
        { hid: 'euphoria-script'       , rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Euphoria+Script' }
      ],
      meta: [
        { hid: 'title'              , name: 'title'              , content: this.alternateName || this.name},
        { hid: 'description'        , name: 'description'        , content: this.description               },
        { hid: 'twitter:title'      , name: 'twitter:title'      , content: this.alternateName || this.name},
        { hid: 'twitter:description', name: 'twitter:description', content: this.description               },
        { hid: 'og:title'           , name: 'og:title'           , content: this.alternateName || this.name},
        { hid: 'og:description'     , name: 'og:description'     , content: this.description               },
        { hid: 'lang'               , name: 'lang'               , content: 'en'                           },
        { hid: 'og:image'           , name: 'og:image'           , content: this.image.src                 },
        { hid: 'twitter:card'       , name: 'twitter:card'       , content: 'summary'                      },
        { hid: 'twitter:site'       , name: 'twitter:site'       , content: '@cathoulahan'                 },
        { hid: 'twitter:image'      , name: 'twitter:image'      , content: this.image.src                 },
        { hid: 'twitter:image:alt'  , name: 'twitter:image:alt'  , content: this.alternateName || this.name}
      ]
    }
  }
</script>

<style scoped>
  .text-section{
    padding: 5em 0 5em 0;
    text-align: center;
    font-size: 16px;
  }
  .text-section h1{
    font-family: 'Euphoria Script', cursive, serif;
    font-size: 50px;
    font-weight: 500;
    color: black;
    margin-bottom: .5em;
  }
  .text-section h2{
    margin-top: 1em;
    font-family: 'Euphoria Script', cursive, serif;
    font-size: 24px;
    font-weight: 500;
    color: black;
  }

  @media screen and (min-width: 648px) {
    .wagon{
      padding: 0 15% 0 15%;
    }
    .text-section h1{
      font-size: 60px;
    }
    .text-section h2{
      font-size: 34px;
    }
  }
</style>
