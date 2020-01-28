<template>
  <amp-menu-container>
    <amp-install-serviceworker src="/sw.js" layout="nodisplay" data-no-service-worker-fallback-url-match=".*" ></amp-install-serviceworker>
    <amp-analytics type="gtag" data-credentials="include">
      <script type="application/json" v-html="gaTagId"></script>
    </amp-analytics>
    <main>
      <CLIcons/>
      <Header/>
      <nuxt/>
      <Footer/>
    </main>
    <SideBar :menu="items"/>
  </amp-menu-container>
</template>

<script>
  import Header  from '~/components/amp/Header'
  import Footer  from '~/components/amp/Footer'
  import SideBar from '~/components/amp/SideBar'
  import CLIcons from '~/components/CLIcons'

  export default {
    components: { Header, Footer, SideBar, CLIcons },
    computed  : { gaTagId },
    methods   : { nonAmpPath },
    head,
    data
  }

  function data() {
    const  { items } = this.$store.state.menu
    return { items }
  }

  function head() {
    return {
      meta: [ { hid: 'viewport', name: 'viewport', content: 'width=device-width,initial-scale=1,minimum-scale=1' } ],
      link: [ { hid: 'canonical', rel: 'canonical', href: this.nonAmpPath(`https://www.circusliving.com${this.$route.path}`) } ]
    }
  }

  function gaTagId(){
    return `{
        "vars" : {
          "gtag_id": "${process.env.GA_TAG_ID}",
              "config" : {
              "${process.env.GA_TAG_ID}": {
                "groups": "default",
                "page_location": "https://www.circusliving.com${this.$route.path}",
                "linker": { "domains": ["circusliving.com", "circusliving.ca"] },
                "site_speed_sample_rate": 100
              }
            }
        }
      }`
  }
  function nonAmpPath(path) { return path.replace('/amp', '') }
</script>

