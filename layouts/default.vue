<template>
  <amp-menu-container>
    <amp-install-serviceworker src="/sw.js" layout="nodisplay" data-no-service-worker-fallback-url-match=".*" ></amp-install-serviceworker>
    <main>
      <CLIcons/>
      <Header/>
      <nuxt/>
      <Footer/>
    </main>
    <SideBar :menu="allMenuItems"/>
  </amp-menu-container>
</template>

<script>
  import Header from '~/components/amp/Header'
  import Footer from '~/components/amp/Footer'
  import SideBar from '~/components/amp/SideBar'
  import CLIcons from '~/components/CLIcons'

  export default {
    components: { Header, Footer, SideBar, CLIcons },
    head,
    data,
    methods: { nonAmpPath }
  }

  function data() {
    return { allMenuItems: this.$store.state.menu.items }
  }

  function head() {
    return {
      meta: [ { hid: 'viewport', name: 'viewport', content: 'width=device-width,initial-scale=1,minimum-scale=1' } ],
      link: [ { hid: 'canonical', rel: 'canonical', href: this.nonAmpPath(`https://www.circusliving.com${this.$route.path}`) } ]
    };
  }

  function nonAmpPath(path) {
    return path.replace('/amp', '');
  }
</script>

