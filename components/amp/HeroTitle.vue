<template>
  <div class="amp-page-hero" :style="{'background-image': `url(${image})`}">
    <h1 >{{title}}</h1>
  </div> 
</template>
<script>
  export default {
    name: 'HeroTitle',
    props:{
      title:{type:String, required:true},
      image:{type:String, default:'https://images.circusliving.com/CircusLiving-Header.jpg'},
    }
  }
</script>
<style scoped>
.amp-page-hero{
  background-repeat: no-repeat;
  background-size: cover;
  height: 300px;
  background-attachment: fixed;
}
.amp-page-hero{
  display: flex;
  align-items: center;
  justify-content: center;
}
.amp-page-hero  h1 {
  padding-top: 66px;
  color: white;
  text-align: center;
}
</style>
