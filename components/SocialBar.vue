<template>
    <div class="social-footer">
        <ul class="social">
        <li><a href="https://www.facebook.com/CircusLiving"><i class="icon-facebook"><Icon  name="facebook"/></i></a></li>
        <li><a href="https://twitter.com/cathoulahan"><i class="icon-twitter"><Icon  name="twitter"/></i></a></li>
        <li><a href="https://plus.google.com/+CircusLiving"><i class="icon-gplus"><Icon  name="google-plus"/></i></a></li>
        <li><a href="https://www.pinterest.com/catvelasco/pins/"><i class="icon-pinterest"><Icon  name="pinterest"/></i></a></li>
        <li><a href="https://www.instagram.com/circus_living_blog/"><i class="icon-instagram"><Icon  name="instagram"/></i></a></li>
        <li><a href="https://www.youtube.com/channel/UCVNe4ithtIPgIFjDmfugS7A"><i class="icon-youtube"><Icon  name="youtube"/></i></a></li>
        </ul>
    </div>
</template>

<script>
    import Icon from './Icon'
    export default {
        name: 'SocialBar',
        components:{Icon}
    }
</script>

<style scoped>

    .social {
        padding: 0;
        margin: 0 0 -5px 0;
        font-size: 0;
        line-height: 1;
    }
    .social li {
        display: inline-block;
        font-family: 'fontello-social';
        margin: 0 5px 5px 0;
    }
    .text-center .social li {
        margin: 0 2px
    }
    .social.pull-right li {
        margin: 5px 0 0 5px
    }
    .social li a {
        display: table;
    }
    .social li a i {
        text-align: center;
        display: table-cell;
        vertical-align: middle;
        color: #f5f5f5;
        background: none;
        line-height: 1;
        border: 1px solid #aaa;
        width: 28px;
        height: 28px ;
        line-height: 1;
        font-size: 12px;
        -webkit-transition: all 200ms ease-in;
        -o-transition: all 200ms ease-in;
        -moz-transition: all 200ms ease-in;
    }
    .social .icon-pinterest {
        border-color: #d8545d;
        color: #d8545d;
    }
    .social .icon-facebook {
        border-color: #677fb5;
        color: #677fb5;
    }
    .social .icon-twitter {
        border-color: #70c2e9;
        color: #70c2e9;
    }
    .social .icon-youtube {
        border-color: #d5615c;
        color: #d5615c;
    }
    .social .icon-gplus {
        border-color: #bc7067;
        color: #bc7067;
    }
    .social .icon-instagram {
        border-color: #926d53;
        color: #926d53;
    }

    .social a:hover > i.icon-pinterest {
        background-color: #d8545d
    }
    .social a:hover > i.icon-facebook {
        background-color: #677fb5
    }
    .social a:hover > i.icon-twitter {
        background-color: #70c2e9
    }
    .social a:hover > i.icon-youtube {
        background-color: #d5615c
    }
    .social a:hover > i.icon-gplus {
        background-color: #bc7067
    }
    .social a:hover > i.google-plus {
        background-color: #bc7067
    }
    .social a:hover > i.icon-instagram {
        background-color: #926d53
    }


</style>
