<template>
    <div v-if="text">
        <div class="container my-3">
            <div class="section-title text-center">
                <h3 >{{alternateName || name}}</h3>
            </div>
            <div class="row">
                <div class="col-sm-5">
                    <figure>
                        <amp-img 
                            layout="responsive"
                            :alt="`${name} image`"
                            :src="image"
                            :width="width"
                            :height="height"
                            :srcset="getSrcSet(image,.4)">
                        </amp-img>
                    </figure>
                </div>
                <div class="col-sm-7" v-html="text">
                  
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import ImageService from '~/modules/ImageService'
    export default {
        name: 'PageBody',
        props:{
            name:{
                type: String,
                required:true
            },
            alternateName:{
                type: String
            },
            text:{
                type: String,
                required:true
            },
            image:{
                type:String
            }
        },
        computed:{width,height},
        methods:{getSrcSet}
    }


    function width(){
        return ImageService.getDimensions(this.image).width
    }
    function height(){
       return ImageService.getDimensions(this.image).height
    }

    function getSrcSet (src, percentage){
        return ImageService.getSrcSet(src, percentage)
    }
</script>

<style scoped>
    .section-title h3{
        font-weight: 700;
        margin-bottom:1em;
    }
    .section-title h3:after, .section-title h3:before {
        display      : inline-block;
        content      : "";
        border-top   : 1px solid #d9d9d9;
        border-bottom: 1px solid #d9d9d9;
        height       : 4px;
        position     : absolute;
        width        : 80px;
        top          : 7px;
    }
    .section-title h3:before {
        left: -100px;
    }
    .section-title h3:after {
        right: -100px;
    }
</style>