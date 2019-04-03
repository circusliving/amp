<template>
  <section>
    <div class="items">

       <div class="item" v-for="(col,index) in buildColums" :key="index">   
          <figure class="fig" v-for="(item,index) in col" :key="index">
            <nuxt-link  :to="getPath(item)">
                <div class="text-overlay">
                  <div class="info" >{{item.name}}</div>
                </div>
                <amp-img
                  amp-fx="fly-in-bottom"
                  data-fly-in-distance="50%"
                  layout="responsive"
                  :width="item.imageObj.width"
                  :height="item.imageObj.height"
                  :src="item.image"
                  :srcset="item.imageObj.srcset"
                >
                </amp-img>
            </nuxt-link >
          </figure>
        </div >
    </div>
  </section>
</template>

<script>
    import {getPath} from '~/modules/helpers'
    export default {
        name     : 'ImageList',
        props    : ['items'],
        computed: {buildColums},
        methods :{getPath}
    }

    function buildColums () {

        let all = {col0: [], col1: [], col2: [], col3: []}
        
        for (let i = 0; i < this.items.length; i++) 
            all[`col${i % 4}`].push(this.items[i])

        for (const key in all) 
          if (!all[key].length) 
            delete(all[key])

        return all
    }

</script>

<style scoped>
#image-grid div{
  padding: 0 0 0 0;
}
figure a .text-overlay {
    opacity: 0;
    height: 100%;
    position: absolute;
    text-decoration: none;
    width: 100%;
    z-index: 100;
    padding: 20px;
    background: #28b8d8;
    background: rgba(40,184,216,0.90);
    -webkit-transition: all 0.4s;
    -moz-transition: all 0.4s;
    -o-transition: all 0.4s;
    transition: all 0.4s;
}
figure a:hover .text-overlay {
    opacity: 1
}
figure a .text-overlay:before {
    content: "";
    display: block;
    position: absolute;
    z-index: -1;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px solid rgba(255,255,255,0.3);
}
figure a .text-overlay .info {
    text-align: center;
    top: 50%;
    width: 100%;
    left: 0;
    position: absolute;
    margin-top: -11px;
    color: #fff;
    font-size: 14px;
    font-weight: normal;
    text-transform: uppercase;
}
.paddingless{
  padding: 0 0 0 0;
}
.card-img-middle h3 {
    margin-top: 0;
    margin-bottom: 10px;
    font-weight: 700;
    text-align: center;
}
.card-img-middle h3 a{
    font-family: 'Roboto Slab', serif;
    color: #444;
    text-decoration: none;
    -webkit-transition: all 200ms ease-in;
    -o-transition: all 200ms ease-in;
    -moz-transition: all 200ms ease-in;
}
.card-img-middle h3 a:hover{
  color: #28b8d8;
}

.card-img-middle h4 {
  text-align: center;
  color: #999;
  font-size: .75em;
  line-height: 1;
  font-weight: 400;
}
.card-img-middle figure{
  margin: 0 -25px 0 -25px;
}
.card-img-middle p{
    color: #666;
    font-weight: normal;
}
.card-img-middle > a{
  font-size: .75em;
  border-bottom: 1px solid #28b8d8;
}
.card-img-middle{

  border: 1px solid rgba(0,0,0,0.1);
  padding: 25px 25px 15px 25px;
  margin-bottom: 30px;
}
.fig{
  display: block;
  overflow: hidden;
  position: relative;
}
.items {
	display: flex;
	flex-wrap: wrap;
  align-content: space-between;
}
.items  .item {
  flex: 1 25%;
}

.column img {
  margin-top: 8px;
  vertical-align: middle;

}

@media screen and (max-width: 1199px) {
  .items  .item {
    flex: 1 50%;
  }
}

@media screen and (max-width: 600px) {
  .items  .item {
    flex: 1 100%;
  }
}
</style>