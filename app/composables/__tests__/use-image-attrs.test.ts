import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useImageAttrs } from '../use-image-attrs';
import { DEFAULT_WIDTHS } from '../../utils/image-service';

const BASE_URL = 'https://www.datocms-assets.com/15223948/hero.webp';

describe('useImageAttrs', () => {
  // ── src ──────────────────────────────────────────────────────────────────────

  describe('src', () => {
    it('returns the provided URL string', () => {
      const { src } = useImageAttrs({ url: BASE_URL });
      expect(src.value).toBe(BASE_URL);
    });

    it('unwraps a ref URL', () => {
      const urlRef = ref(BASE_URL);
      const { src } = useImageAttrs({ url: urlRef });
      expect(src.value).toBe(BASE_URL);
    });

    it('unwraps a getter URL', () => {
      const { src } = useImageAttrs({ url: () => BASE_URL });
      expect(src.value).toBe(BASE_URL);
    });

    it('returns empty string for empty URL', () => {
      const { src } = useImageAttrs({ url: '' });
      expect(src.value).toBe('');
    });

    it('is reactive — updates when a ref URL changes', () => {
      const urlRef = ref(BASE_URL);
      const { src } = useImageAttrs({ url: urlRef });

      expect(src.value).toBe(BASE_URL);

      const next = 'https://www.datocms-assets.com/99999/other.jpg';
      urlRef.value = next;
      expect(src.value).toBe(next);
    });
  });

  // ── alt ──────────────────────────────────────────────────────────────────────

  describe('alt', () => {
    it('returns the provided alt string', () => {
      const { alt } = useImageAttrs({ url: BASE_URL, alt: 'Hero image' });
      expect(alt.value).toBe('Hero image');
    });

    it('defaults to empty string when alt is not provided', () => {
      const { alt } = useImageAttrs({ url: BASE_URL });
      expect(alt.value).toBe('');
    });

    it('unwraps a ref alt', () => {
      const altRef = ref('Circus Living');
      const { alt } = useImageAttrs({ url: BASE_URL, alt: altRef });
      expect(alt.value).toBe('Circus Living');
    });

    it('is reactive — updates when a ref alt changes', () => {
      const altRef = ref('Initial alt');
      const { alt } = useImageAttrs({ url: BASE_URL, alt: altRef });

      expect(alt.value).toBe('Initial alt');
      altRef.value = 'Updated alt';
      expect(alt.value).toBe('Updated alt');
    });
  });

  // ── srcSet ───────────────────────────────────────────────────────────────────

  describe('srcSet', () => {
    it('uses DEFAULT_WIDTHS when no widths option is provided', () => {
      const { srcSet } = useImageAttrs({ url: BASE_URL });
      const parts = srcSet.value.split(', ');
      expect(parts).toHaveLength(DEFAULT_WIDTHS.length);
    });

    it('contains the correct srcset entries for default widths', () => {
      const { srcSet } = useImageAttrs({ url: BASE_URL });
      for (const w of DEFAULT_WIDTHS) {
        expect(srcSet.value).toContain(`?w=${w} ${w}w`);
      }
    });

    it('uses custom widths when provided', () => {
      const { srcSet } = useImageAttrs({ url: BASE_URL, widths: [100, 200] });
      expect(srcSet.value).toBe(
        `${BASE_URL}?w=100 100w, ${BASE_URL}?w=200 200w`,
      );
    });

    it('returns empty string when url is empty', () => {
      const { srcSet } = useImageAttrs({ url: '' });
      expect(srcSet.value).toBe('');
    });

    it('is reactive — updates when url changes', () => {
      const urlRef = ref(BASE_URL);
      const { srcSet } = useImageAttrs({ url: urlRef, widths: [320] });

      expect(srcSet.value).toBe(`${BASE_URL}?w=320 320w`);

      const next = 'https://www.datocms-assets.com/99999/other.jpg';
      urlRef.value = next;
      expect(srcSet.value).toBe(`${next}?w=320 320w`);
    });
  });

  // ── return shape ─────────────────────────────────────────────────────────────

  describe('return shape', () => {
    it('returns computed refs for src, srcSet, and alt', () => {
      const result = useImageAttrs({ url: BASE_URL, alt: 'Test' });

      // computed refs are distinguishable by the `effect` property; for test
      // purposes we just verify .value is accessible and the object is ref-like.
      expect(result).toHaveProperty('src');
      expect(result).toHaveProperty('srcSet');
      expect(result).toHaveProperty('alt');
      expect(typeof result.src.value).toBe('string');
      expect(typeof result.srcSet.value).toBe('string');
      expect(typeof result.alt.value).toBe('string');
    });
  });
});
