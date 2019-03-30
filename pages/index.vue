<template>
  <section >
page data starts
<pre>--{{allArticles}}--</pre>
  </section>
</template>

<script>
import allArticles from '~/apollo/allArticles'
// import gql from 'graphql-tag'
export default {
  name: 'index',
  data () {
    return {
      articles: '',
      loading: 0
    }
  },
  apollo: {
    allArticles: { query: allArticles },
    $prefetch: false
    // $query: {
    //   loadingKey: 'loading'
    // }
  }
}
</script>