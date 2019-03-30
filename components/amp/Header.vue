<template>
  <section>
      <header class="amp-headerbar">
        <div class="amp-cont">
          <amp-img src="https://images.circusliving.com/500x69/circus-living-logo.png" alt="New York cars." width="283" height="35" layout="intrinsic" ></amp-img>
        </div>
        <div role="button" aria-label="open sidebar" on="tap:header-sidebar.toggle" tabindex="0" class="amp-navbar-trigger">
          <span class="bb">☰</span>
        </div>
      </header>
  </section>
</template>

<script>
  export default {
    name: 'AmpHeader'
  }
</script>

<style scoped>
  .bb{
    background: rgb(40, 184, 216);
    padding: .5em .5em .5em .5em;
  }
  .amp-cont{
    display: flex;
    flex-grow: 1;
  }
  .amp-headerbar {
    position:fixed;
    display: flex;
    background-color: rgba(0,0,0,.8);
    color: #fff;
    z-index: 999;
    box-shadow: 0 0 5px 2px rgba(0,0,0,.1);
    justify-content: flex-start;
    top:0;
    left:0;
    right:0;
    padding: .5em 1em .5em 1em;
  }
  .amp-navbar-trigger{
    cursor: pointer;
    text-decoration: none;
    line-height: 2.5em;
    font-size: 1.25em;
    align-items: flex-start;
  }
  .amp-navbar-trigger:focus{
    outline: 0
  }
</style>