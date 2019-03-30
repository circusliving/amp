<template>
  <!-- Start Sidebar -->
  <amp-sidebar id="header-sidebar" class="amp-sidebar" layout="nodisplay" side="left">
    <div >
      &nbsp;
      <span role="button" aria-label="close sidebar" on="tap:header-sidebar.toggle" tabindex="0" class="float-r">✕</span>
    </div>
    <div>
      <amp-img src="https://images.circusliving.com/circus-living-logo.png" alt="Circus Licving Logo" width="283" height="35" layout="intrinsic" ></amp-img>
    </div>
    <nav class="pt-3">
      <AmpSideMenu
        v-for="item in menu"
        :path="item.path"
        :name="item.menuName || item.name"
        :nodes="item.nodes"
        :key="item.path"
      />
    </nav>
    <div class="text-center mt-4">
      <SocialBar/>
    </div>
  </amp-sidebar>
</template>

<script>
  import AmpSideMenu  from './AmpSideMenu.vue'
  import SocialBar from '~/components/SocialBar.vue'
  export default {
    props: [ 'menu' ],
    name: 'SideBar',
    components:{AmpSideMenu,SocialBar}
  }
</script>

<style >
  .amp-sidebar {
    background-color: rgba(0,0,0,.9);
    color: #fff;
    min-width: 300px;
    width: 300px;
    padding:0 1.5em 0 1.5em;
  }
  .float-r{
    float:right;
  }
</style>
