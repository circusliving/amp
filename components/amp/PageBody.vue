<template>
    <div v-if="text">
        <div class="container my-3">
            <AmpSectionHeader :title="altName" v-if="altName"/>
            <div class="row">
                <div class="col-sm-5">
                    <figure>
                        <amp-img 
                            layout="responsive"
                            :alt="`${name} ${alt}`"
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
    import ImageService     from '~/modules/ImageService'
    import AmpSectionHeader from '~/components/amp/AmpSectionHeaderH2'

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
        components:{AmpSectionHeader},
        computed:{altName,width,height,alt},
        methods:{getSrcSet}
    }


    function width(){
        return ImageService.width(this.image)
    }
    
    function height(){
       return ImageService.height(this.image)
    }
    function alt(){
       return ImageService.alt(this.image)
    }
    function getSrcSet (src, percentage){
        return ImageService.getSrcSet(src, percentage)
    }

    function altName (){
        if(!this.alternateName) return ''
        if(this.name === this.alternateName)
        return ''
        return this.alternateName
    }
</script>