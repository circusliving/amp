<template>
  <section>
    <amp-accordion animate v-if="(nodes && nodes.length)" layout="container" disable-session-states="" class="ampstart-dropdown">
      <section>
        <header   class="amp-dropdown-header">
          <span class="not-active blue">{{name}}</span>
          <span class="active">{{name}}</span>
          <i class="icon-angle-up active float-r"></i>
          <i class="icon-angle-down blue float-r not-active"></i>
        </header>
        <div >
          <div :key="node.path" v-for="node in nodes" class="amp-dropdown-child" >
            <nuxt-link  :to="`${node.path}`" > {{node.name}}<br/></nuxt-link >
          </div>
        </div>
      </section>
    </amp-accordion>
    <nuxt-link  :to="`${path}`" v-else> {{name}} </nuxt-link >
  </section>
</template>
<script>
  export default {
    name: 'AmpSideMenu',
    props: [ 'name', 'path', 'nodes' ],
  }
</script>
<style scoped>
  .blue{
    color: rgb(40, 184, 216);
  }
  .float-r{
    float:right;
  }
  .amp-dropdown-header:focus {
    outline: 0
  }
  .amp-dropdown-child:focus {
    outline: 0
  }
  amp-accordion section[expanded] .active {
    color: rgb(40, 184, 216);
    display: none;
  }
  amp-accordion section:not([expanded]) .not-active {
    color: rgb(40, 184, 216);
    display: none;
  }
  .amp-dropdown{
  background-color: rgba(0,0,0,.9);
}
.amp-dropdown-header{
  background-color: rgba(0,0,0,.9);
  border: none;
  cursor: pointer;
}
.amp-dropdown-child{
  padding-left: 1em;
  white-space: nowrap;
  font-size: 1em;
  cursor: pointer;
}
.amp-dropdown-header,.amp-dropdown-child a{
  color: white;
  text-decoration: none;
}
.amp-dropdown-child:hover a{
  color: rgb(40, 184, 216);
  -webkit-transition: all 200ms ease-in;
}
.amp-dropdown-header:hover{
  color: rgb(40, 184, 216);
  -webkit-transition: all 200ms ease-in;
}
</style>