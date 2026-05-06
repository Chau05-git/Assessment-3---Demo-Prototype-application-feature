import { useCallback } from 'react';

import { BAD_WORDS } from '@/constants/bad-words';

export type FilterResult = {
  filtered: string;
  count: number;
};

/**
 * Returns a stable filter function that detects and replaces bad words with asterisks.
 *
 * Uses Unicode-aware boundaries so it matches whole words for both Latin
 * (English) and Vietnamese (with diacritics).
 */
export function useBadWordFilter(): (text: string) => FilterResult {
  return useCallback((text: string): FilterResult => {
    let count = 0;
    let filtered = text;
    for (const word of BAD_WORDS) {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Negative lookbehind/ahead: not preceded/followed by any letter
      // [A-Za-zÀ-ỹ] covers Latin + Vietnamese diacritic range
      const re = new RegExp(
        `(?<![A-Za-zÀ-ỹ])${escaped}(?![A-Za-zÀ-ỹ])`,
        'gi'
      );
      filtered = filtered.replace(re, (match) => {
        count++;
        return '*'.repeat(match.length);
      });
    }
    return { filtered, count };
  }, []);
}
