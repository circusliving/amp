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
});
</script>

<template>
  <div class="site-wrapper" :class="{ 'site-wrapper--menu-open': menuStore.isOpen }">
    <HeaderBar />
    <SideBar />
    <main class="site-wrapper__main">
      <slot />
    </main>
    <FooterBar />
  </div>
</template>

<style scoped lang="scss">
.site-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1 1 auto;
  }
}
</style>
