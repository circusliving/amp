<template>
  <!-- card list -->
  <section>
    <div class="container mx-2">
      <div class="card-columns">
        <Card v-for="(item,index) in items" :key="index" v-bind="item"/>
      </div>
    </div>
  </section>
</template>

<script>
  import Card from '~/components/amp/Card'

  export default {
    name      : 'CardList',
    components: {Card},
    props     : ['items']
  }
</script>
  
