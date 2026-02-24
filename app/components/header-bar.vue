<script setup lang="ts">
const menuStore = useMenuStore();
</script>

<template>
  <header class="header-bar">
    <div class="header-bar__container">
      <div class="header-bar__logo">
        <NuxtLink to="/" aria-label="Circus Living Home">
          <NuxtImg
            src="https://images.circusliving.com/347x50/circus-living-logo.png"
            alt="Circus Living Logo"
            width="347"
            height="50"
            loading="eager"
            class="header-bar__logo-img"
          />
        </NuxtLink>
      </div>
      <button
        class="header-bar__menu-toggle"
        :aria-expanded="menuStore.isOpen"
        aria-controls="sidebar"
        aria-label="Toggle navigation menu"
        @click="menuStore.toggle()"
      >
        <span class="header-bar__menu-icon" aria-hidden="true">&#9776;</span>
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  max-height: 65px;
  padding: 0.5em 1em;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-height: 50px;
  }

  &__logo {
    max-height: 50px;
    display: flex;
    align-items: center;

    &-img {
      display: block;
      max-height: 50px;
      width: auto;
    }
  }

  &__menu-toggle {
    background: rgb(40, 184, 216);
    border: none;
    cursor: pointer;
    padding: 0.5em;
    line-height: 1;
    color: #fff;

    &:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
  }

  &__menu-icon {
    font-size: 1.25em;
    line-height: 1;
  }
}
</style>
