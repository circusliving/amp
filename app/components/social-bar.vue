<script setup lang="ts">
const links = [
  { href: 'https://www.facebook.com/CircusLiving', label: 'Facebook', icon: 'facebook', cssClass: 'icon-facebook' },
  { href: 'https://twitter.com/cathoulahan', label: 'Twitter', icon: 'twitter', cssClass: 'icon-twitter' },
  { href: 'https://plus.google.com/+CircusLiving', label: 'Google Plus', icon: 'google-plus', cssClass: 'icon-gplus' },
  { href: 'https://www.pinterest.com/catvelasco/pins/', label: 'Pinterest', icon: 'pinterest', cssClass: 'icon-pinterest' },
  { href: 'https://www.instagram.com/circus_living_blog/', label: 'Instagram', icon: 'instagram', cssClass: 'icon-instagram' },
  { href: 'https://www.youtube.com/channel/UCVNe4ithtIPgIFjDmfugS7A', label: 'Youtube', icon: 'youtube', cssClass: 'icon-youtube' },
] as const;
</script>

<template>
  <div class="social-bar">
    <ul class="social-bar__list">
      <li
        v-for="link in links"
        :key="link.icon"
        class="social-bar__item"
      >
        <a
          :href="link.href"
          :aria-label="link.label"
          target="_blank"
          rel="noopener noreferrer"
          class="social-bar__link"
        >
          <i :class="['social-bar__icon', link.cssClass]" aria-hidden="true">
            <Icon :name="link.icon" />
          </i>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.social-bar {
  &__list {
    padding: 0;
    margin: 0 0 -5px 0;
    font-size: 0;
    line-height: 1;
    list-style: none;
  }

  &__item {
    display: inline-block;
    font-family: 'fontello-social';
    margin: 0 5px 5px 0;

    .text-center & {
      margin: 0 2px;
    }
  }

  &__link {
    display: table;
  }

  &__icon {
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    color: #f5f5f5;
    background: none;
    border: 1px solid #aaa;
    width: 28px;
    height: 28px;
    line-height: 1;
    font-size: 12px;
    transition: all 200ms ease-in;

    &.icon-pinterest {
      border-color: #d8545d;
      color: #d8545d;
    }
    &.icon-facebook {
      border-color: #677fb5;
      color: #677fb5;
    }
    &.icon-twitter {
      border-color: #70c2e9;
      color: #70c2e9;
    }
    &.icon-youtube {
      border-color: #d5615c;
      color: #d5615c;
    }
    &.icon-gplus {
      border-color: #bc7067;
      color: #bc7067;
    }
    &.icon-instagram {
      border-color: #926d53;
      color: #926d53;
    }
  }

  &__link:hover > .icon-pinterest { background-color: #d8545d; }
  &__link:hover > .icon-facebook  { background-color: #677fb5; }
  &__link:hover > .icon-twitter   { background-color: #70c2e9; }
  &__link:hover > .icon-youtube   { background-color: #d5615c; }
  &__link:hover > .icon-gplus     { background-color: #bc7067; }
  &__link:hover > .icon-instagram { background-color: #926d53; }
}
</style>
