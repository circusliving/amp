<script setup lang="ts">
import type { Article } from '~~/shared/types/article';

const { webPage } = useWebPage();

// Fetch latest articles for the feed section
const { data: latestArticles } = await useFetch<Article[]>('/api/articles/latest', {
  query: { limit: 6 },
});

// Hero image derived from CMS web page cover image
const heroImage = computed(() =>
  webPage.value?.coverImage ? { url: webPage.value.coverImage } : undefined,
);

// Static sideshow promotional cards — not CMS articles, modelled as Article shape.
// Typed as a 3-tuple so index access returns Article (not Article | undefined).
const sideshowCards: [Article, Article, Article] = [
  {
    identifier: 'sideshows-monsters',
    name: 'Mysterious Monster Marvels',
    alternateName: 'Legendary Creatures. Curious Cryptids. Mythical Beasts',
    description:
      '\u201cAnd above all, watch with glittering eyes the whole world around you because the greatest secrets are always hidden in the most unlikely places. Those who don\u2019t believe in magic will never find it.\u201d \u2014 Roald Dahl',
    coverImage: 'https://images.circusliving.com/375x222/mysteriousmonstermarvels.min.jpg',
    url: '/side-shows/mysterious-monster-marvels',
  },
  {
    identifier: 'sideshows-curiosities',
    name: 'Cabinet of Curiosities',
    alternateName: "\u2018Macabre\u2019 Artists. Gothic Works. Steampunk Creations",
    description:
      '\u201cA painter should begin every canvas with a wash of black, because all things in nature are dark except where exposed by the light.\u201d \u2014 Leonardo da Vinci',
    coverImage: 'https://images.circusliving.com/375x222/cabinetofcuriosities.min.jpg',
    url: '/side-shows/cabinet-of-curiosities',
  },
  {
    identifier: 'sideshows-magical',
    name: 'Magical and Mystical Experiences',
    alternateName: 'Enchanting Experiences, Ethereal Places Celestial Reflections',
    description:
      '\u201cPleasure to me is wonder\u2014the unexplored, the unexpected, the thing that is hidden and the changeless thing that lurks behind superficial mutability.\u201d \u2014 H.P. Lovecraft',
    coverImage: 'https://images.circusliving.com/375x222/magicalmysticalexp.min.jpg',
    url: '/side-shows/magical-mystical-experiences',
  },
];
</script>

<template>
  <section>
    <HeroTitle title=" " :image="heroImage" />

    <div class="text-section">
      <h1>Greetings Friend</h1>
      We&rsquo;ve been eagerly awaiting your arrival.<br >
      Fate has delivered you to us at our entreat.<br >
      Rest assured your visit has not come unnoticed.<br >
      There is no need to tread lightly.<br >
      We welcome your kind.<br >
      Banal normalcy is far from the norm here.

      <h2>&hellip;welcome to Circus Living.</h2>
    </div>

    <SectionHeaderH3 title="SIDESHOWS" />

    <ThreeCards>
      <template #first>
        <CardCl :article="sideshowCards[0]" />
      </template>
      <template #second>
        <CardCl :article="sideshowCards[1]" />
      </template>
      <template #third>
        <CardCl :article="sideshowCards[2]" />
      </template>
    </ThreeCards>

    <br >

    <QuotesCarousel>
      <template #quoteOne>
        <QuoteBlock
          quote="I have always dreamed of lifting the veil of this world to expose another, one parallel to ours which we have all probably sensed at some point yet been unable to see clearly."
          author="Nicole Watt of Mahlimae"
        />
      </template>
      <template #quoteTwo>
        <QuoteBlock
          quote="Many people are scared or intrigued by monster stories even if they don't believe they are true. It's easy to be skeptical when you're home in your living room but it's a lot harder when you're out in the woods at night."
          author="Peter Muise"
        />
      </template>
      <template #quoteThree>
        <QuoteBlock
          quote="I'm constantly motivated and inspired by the human condition. Those with afflictions or abnormalities, for lack of a better word are infinitely more interesting than the rest of us."
          author="Colleen Downs of Dolldrums"
        />
      </template>
    </QuotesCarousel>

    <br >

    <div class="wagon">
      <CardList v-if="!webPage?.widget" :articles="latestArticles ?? []" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.text-section {
  padding: 5em 0 5em 0;
  text-align: center;
  font-size: 16px;

  h1 {
    font-family: 'Euphoria Script', cursive, serif;
    font-size: 50px;
    font-weight: 500;
    color: black;
    margin-bottom: 0.5em;
  }

  h2 {
    margin-top: 1em;
    font-family: 'Euphoria Script', cursive, serif;
    font-size: 24px;
    font-weight: 500;
    color: black;
  }
}

@media screen and (min-width: 648px) {
  .wagon {
    padding: 0 15% 0 15%;
  }

  .text-section {
    h1 {
      font-size: 60px;
    }

    h2 {
      font-size: 34px;
    }
  }
}
</style>
