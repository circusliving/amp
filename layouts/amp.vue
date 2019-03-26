<template>
  <amp-menu-container>  
    <main>
      <CLIcons/> 
      <Header/>
      <nuxt />
      <Footer/>
    </main>
    <SideBar :menu="allMenuItems"/>
  </amp-menu-container>
</template>

<script>
import Header from  '~/components/amp/Header'
import Footer from  '~/components/amp/Footer'
import SideBar from '~/components/amp/SideBar'
import CLIcons from '~/components/CLIcons'

export default {
  name: 'amp',
  components: { Header, Footer, SideBar, CLIcons },
  data: function () {
    return {allMenuItems: this.$store.state.menu.items}
  },
  head () {
    return {
      meta: [
        { hid: 'viewport', name: 'viewport', content: 'width=device-width,initial-scale=1,minimum-scale=1' }
      ],
      link: [
        { hid: 'canonical', rel: 'canonical', href: this.nonAmpPath(`https://www.circusliving.com${this.$route.path}`) }
      ]
    }
  },
  methods: {
    nonAmpPath: nonAmpPath
  }
}
function nonAmpPath (path) {
  return path.replace('/amp', '')
}
</script>

