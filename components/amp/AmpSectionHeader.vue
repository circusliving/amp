<template>
  <section>
    <div class="section-title">
      <h3>
        <amp-img media="(min-width: 649px)" src="https://images.circusliving.com/title-decoration.svg" alt="title decoration" width="80" height="10" layout="fixed" ></amp-img>
        {{title}}
        <amp-img media="(min-width: 649px)" src="https://images.circusliving.com/title-decoration.svg" alt="title decoration" width="80" height="10" layout="fixed" ></amp-img>
      </h3>
    </div>
  </section>
</template>
<script>
  export default {
    name: 'AmpSectionHeader',
    props: [ 'title' ]
  }

</script>
