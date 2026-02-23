import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { buildSrcSet, DEFAULT_WIDTHS } from '../utils/image-service';

export interface ImageAttrsOptions {
  /** Absolute image URL, or a ref/getter that returns one. */
  url: MaybeRefOrGetter<string>;
  /** Alt text for the image, or a ref/getter that returns it. */
  alt?: MaybeRefOrGetter<string>;
  /**
   * Custom set of widths (px) to include in the srcset.
   * Defaults to {@link DEFAULT_WIDTHS}.
   */
  widths?: number[];
}

export interface UseImageAttrsReturn {
  /** Reactive `src` attribute — the original URL, unwrapped. */
  src: import('vue').ComputedRef<string>;
  /** Reactive `srcset` attribute string. */
  srcSet: import('vue').ComputedRef<string>;
  /** Reactive `alt` attribute. */
  alt: import('vue').ComputedRef<string>;
}

/**
 * Composable that converts a raw image URL into reactive `src`, `srcset`, and
 * `alt` attributes suitable for use on an `<img>` element.
 *
 * Replaces the duplicated width/height/alt computed properties in:
 *   - `components/amp/PageBody.vue`
 *   - `components/amp/HeroTitle.vue`
 *   - `pages/articles/_id.vue`
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { src, srcSet, alt } = useImageAttrs({
 *   url: () => article.coverImage ?? '',
 *   alt: () => article.name,
 * });
 * </script>
 *
 * <template>
 *   <img :src="src" :srcset="srcSet" :alt="alt" />
 * </template>
 * ```
 */
export function useImageAttrs(options: ImageAttrsOptions): UseImageAttrsReturn {
  const src = computed<string>(() => toValue(options.url) ?? '');
  const alt = computed<string>(() => toValue(options.alt ?? '') ?? '');
  const srcSet = computed<string>(() =>
    buildSrcSet(src.value, options.widths ?? [...DEFAULT_WIDTHS]),
  );

  return { src, srcSet, alt };
}
