<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';

const menuStore = useMenuStore();

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && menuStore.isOpen) {
    menuStore.close();
  }
}

function handleBackdropClick(): void {
  menuStore.close();
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div>
    <!-- Backdrop overlay -->
    <Transition name="backdrop">
      <div
        v-if="menuStore.isOpen"
        class="side-bar__backdrop"
        aria-hidden="true"
        @click="handleBackdropClick"
      />
    </Transition>

    <!-- Sidebar panel -->
    <aside
      id="sidebar"
      class="side-bar"
      :class="{ 'side-bar--open': menuStore.isOpen }"
      :aria-hidden="!menuStore.isOpen"
    >
      <div class="side-bar__header">
        <NuxtLink to="/" class="side-bar__logo-link" @click="menuStore.close()">
          <NuxtImg
            src="https://images.circusliving.com/circus-living-logo.png"
            alt="Circus Living Logo"
            width="283"
            height="35"
            loading="lazy"
            class="side-bar__logo"
          />
        </NuxtLink>
        <button
          class="side-bar__close"
          aria-label="Close navigation menu"
          @click="menuStore.close()"
        >
          &#x2715;
        </button>
      </div>

      <div class="side-bar__nav">
        <SideMenu />
      </div>

      <div class="side-bar__social">
        <SocialBar />
      </div>
    </aside>
  </div>
</template>

<style scoped lang="scss">
.side-bar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
  width: 300px;
  min-width: 300px;
  background-color: rgba(0, 0, 0, 0.9);
  color: #fff;
  padding: 0 1.5em;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  overflow-y: auto;

  &--open {
    transform: translateX(0);
  }

  &__backdrop {
    position: fixed;
    inset: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75em 0;
  }

  &__logo-link {
    display: flex;
    align-items: center;
  }

  &__logo {
    display: block;
    max-height: 35px;
    width: auto;
  }

  &__close {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.25em;
    cursor: pointer;
    line-height: 1;
    padding: 0.25em;
    margin-left: auto;

    &:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
  }

  &__nav {
    padding-top: 0.75em;
  }

  &__social {
    text-align: center;
    margin-top: 1.5em;
  }
}

// Backdrop transition
:global(.backdrop-enter-active),
:global(.backdrop-leave-active) {
  transition: opacity 0.3s ease;
}

:global(.backdrop-enter-from),
:global(.backdrop-leave-to) {
  opacity: 0;
}
</style>
