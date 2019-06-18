<template>
  <header class="amp-headerbar">
    <div class="container">
      <div class="row">
        <div class="col-10 px-0 ">
          <div class="logo-cont">
            <amp-img src="https://images.circusliving.com/347x50/circus-living-logo.png" alt="Circus Living Logo" width="347" height="50" layout="intrinsic" ></amp-img>
          </div>
        </div>
        <div class="col-2 px-0 ">
          <div class="amp-navbar-trigger text-right" role="button" aria-label="open sidebar" on="tap:header-sidebar.toggle" tabindex="0" >
            <span class="bb">☰</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'AmpHeader'
  }
</script>

<style scoped>
  .logo-cont{
    max-height: 50px;
  }
  .bb{
    background: rgb(40, 184, 216);
    padding: .5em .5em .5em .5em;
  }
  .container{
    max-height: 65px;
    min-width: 65px;
  }
  .amp-headerbar {
    position:fixed;
    background-color: rgba(0,0,0,.8);
    color: #fff;
    z-index: 999;
    box-shadow: 0 0 5px 2px rgba(0,0,0,.1);
    top:0;
    left:0;
    right:0;
    padding: .5em 1em .5em 1em;
    max-height: 65px;
  }
  .amp-navbar-trigger{
    cursor: pointer;
    text-decoration: none;
    line-height: 2.5em;
    font-size: 1.25em;
  }
  .amp-navbar-trigger:focus{
    outline: 0
  }

</style>