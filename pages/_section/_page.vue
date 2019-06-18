<template>
  <section >
    <HeroTitle :title="page.name" :image="coverImage"/>
    <PageBody   v-bind="page" />
    <ImageList :items="items"     v-if="widget" />
    <CardList  :items="items"     v-if="!widget" />
  </section>
</template>

<script>

  import webPageMixin   from '~/modules/webPageMixin'
  
  import HeroTitle      from '~/components/amp/HeroTitle'  
  import PageBody       from '~/components/amp/PageBody'
  import ImageList      from '~/components/amp/ImageList'
  import CardList       from '~/components/amp/CardList'

  export default {
    name       : 'Page',
    mixins     : [ webPageMixin ],
    components : { PageBody, ImageList, HeroTitle, CardList }
  } 
</script>