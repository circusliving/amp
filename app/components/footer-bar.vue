<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="footer-bar">
    <div class="footer-bar__row">
      <div class="footer-bar__copy">
        <span class="footer-bar__copy-text">&copy;{{ currentYear }} Circus Living. All rights reserved.</span>
      </div>
      <div class="footer-bar__social">
        <SocialBar />
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer-bar {
  background-color: black;
  color: white;
  min-height: 95px;
  padding: 0 1em;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  &__copy {
    margin-top: 2em;

    &-text {
      font-size: 0.8em;
    }
  }

  &__social {
    margin-top: 2em;
    text-align: right;
  }

  @media screen and (max-width: 575px) {
    &__copy,
    &__social {
      width: 100%;
      text-align: center;
      margin-top: 0;
    }

    &__row {
      padding: 1em 0 1.3em 0;
    }

    &__social {
      padding-top: 1em;
    }
  }
}
</style>
