<script setup lang="ts">
import type { MenuItem } from '~~/shared/types/menu';

const navigationStore = useNavigationStore();
const menuStore = useMenuStore();

function displayName(item: MenuItem): string {
  return item.menuName || item.name;
}
</script>

<template>
  <nav class="side-menu" aria-label="Main navigation">
    <ul class="side-menu__list">
      <li
        v-for="item in navigationStore.menuItems"
        :key="item.path"
        class="side-menu__item"
      >
        <!-- Parent with children: use details/summary accordion -->
        <details v-if="item.nodes && item.nodes.length" class="side-menu__accordion">
          <summary class="side-menu__summary">
            {{ displayName(item) }}
          </summary>
          <ul class="side-menu__sub-list">
            <li
              v-for="child in item.nodes"
              :key="child.path"
              class="side-menu__sub-item"
            >
              <NuxtLink
                :to="child.path"
                class="side-menu__link side-menu__link--child"
                @click="menuStore.close()"
              >
                {{ displayName(child) }}
              </NuxtLink>
            </li>
          </ul>
        </details>

        <!-- Leaf node: direct link -->
        <NuxtLink
          v-else
          :to="item.path"
          class="side-menu__link"
          @click="menuStore.close()"
        >
          {{ displayName(item) }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
$link-color: #fff;
$link-active-color: rgb(40, 184, 216);
$link-current-color: rgba(255, 255, 255, 0.55);

.side-menu {
  &__list,
  &__sub-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    margin-bottom: 0;
  }

  &__accordion {
    > summary {
      list-style: none;

      &::marker {
        content: '';
      }

      &::-webkit-details-marker {
        display: none;
      }
    }
  }

  &__summary {
    display: block;
    cursor: pointer;
    padding: 0.45em 0;
    color: $link-color;
    font-size: 1em;
    line-height: 1.25;
    border: none;
    background: none;
    text-decoration: none;

    &:focus-visible {
      outline: 2px solid $link-active-color;
      outline-offset: 2px;
    }

    &:hover {
      color: $link-active-color;
      transition: all 200ms ease-in;
    }
  }

  &__sub-list {
    padding-left: 0.75em;
  }

  &__link {
    display: block;
    padding: 0.45em 0;
    color: $link-color;
    text-decoration: none;
    white-space: nowrap;
    font-size: 1em;
    line-height: 1.25;

    &:hover {
      color: $link-active-color;
      transition: all 200ms ease-in;
    }

    &.router-link-active,
    &.router-link-exact-active {
      color: $link-current-color;
      background: transparent;
    }

    &.router-link-active:hover,
    &.router-link-exact-active:hover {
      color: $link-current-color;
    }

    &--child {
      white-space: nowrap;
      font-size: 1em;
      padding-left: 0;
    }
  }
}
</style>
