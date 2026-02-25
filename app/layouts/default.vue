<script setup lang="ts">
const navigationStore = useNavigationStore();
const menuStore = useMenuStore();

// Fetch navigation menu on app load (SSR-safe via $fetch + useAsyncData)
const { data: menuData } = await useAsyncData('navigation', () => $fetch<import('~~/shared/types/menu').MenuItem[]>('/api/menu'));
if (menuData.value) {
  navigationStore.menuItems = menuData.value;
}

useSeoHead({
  title: 'Circus Living',
  description: 'Circus Living — discover unique acrobatic arts, performances, and community.',
  type: 'website',
  canonicalPath: '/',
});
</script>

<template>
  <div class="site-wrapper" :class="{ 'site-wrapper--menu-open': menuStore.isOpen }">
    <a href="#main-content" class="skip-to-content">Skip to main content</a>
    <HeaderBar />
    <SideBar />
    <main id="main-content" class="site-wrapper__main">
      <slot />
    </main>
    <FooterBar />
  </div>
</template>

<style scoped lang="scss">
.skip-to-content {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 9999;
  padding: 0.5rem 1rem;
  background: #000;
  color: #fff;
  font-weight: bold;
  text-decoration: none;

  &:focus {
    top: 0;
  }
}

.site-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1 1 auto;
  }
}
</style>
