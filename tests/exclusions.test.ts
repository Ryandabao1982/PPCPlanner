// @vitest-environment jsdom

/**
 * Tests for Exclusions Utility
 * 
 * This file tests keyword exclusion functionality including:
 * - EXCLUSION_WORD_LIST: List of excluded words
 * - EXCLUSION_WORD_SET: Efficient lookup set for exclusions
 */
import { describe, it, expect } from 'vitest';
import { EXCLUSION_WORD_LIST, EXCLUSION_WORD_SET } from '../utils/exclusions';

describe('Exclusions Utility', () => {
    describe('EXCLUSION_WORD_LIST', () => {
        it('should be an array', () => {
            expect(Array.isArray(EXCLUSION_WORD_LIST)).toBe(true);
        });

        it('should contain generic noise words', () => {
            expect(EXCLUSION_WORD_LIST).toContain('the');
            expect(EXCLUSION_WORD_LIST).toContain('and');
            expect(EXCLUSION_WORD_LIST).toContain('or');
            expect(EXCLUSION_WORD_LIST).toContain('for');
        });

        it('should contain quantity variation terms', () => {
            expect(EXCLUSION_WORD_LIST).toContain('pack');
            expect(EXCLUSION_WORD_LIST).toContain('bundle');
            expect(EXCLUSION_WORD_LIST).toContain('size');
            expect(EXCLUSION_WORD_LIST).toContain('large');
        });

        it('should contain subjective modifiers', () => {
            expect(EXCLUSION_WORD_LIST).toContain('best');
            expect(EXCLUSION_WORD_LIST).toContain('cheap');
            expect(EXCLUSION_WORD_LIST).toContain('top');
            expect(EXCLUSION_WORD_LIST).toContain('quality');
        });

        it('should contain commerce stopwords', () => {
            expect(EXCLUSION_WORD_LIST).toContain('buy');
            expect(EXCLUSION_WORD_LIST).toContain('sale');
            expect(EXCLUSION_WORD_LIST).toContain('discount');
            expect(EXCLUSION_WORD_LIST).toContain('amazon');
        });

        it('should contain non-product terms', () => {
            expect(EXCLUSION_WORD_LIST).toContain('how');
            expect(EXCLUSION_WORD_LIST).toContain('where');
            expect(EXCLUSION_WORD_LIST).toContain('review');
            expect(EXCLUSION_WORD_LIST).toContain('return');
        });

        it('should contain temporal words', () => {
            expect(EXCLUSION_WORD_LIST).toContain('today');
            expect(EXCLUSION_WORD_LIST).toContain('now');
            expect(EXCLUSION_WORD_LIST).toContain('2023');
            expect(EXCLUSION_WORD_LIST).toContain('2024');
        });

        it('should have a reasonable size', () => {
            // Should have at least 50 exclusion words
            expect(EXCLUSION_WORD_LIST.length).toBeGreaterThan(50);
        });
    });

    describe('EXCLUSION_WORD_SET', () => {
        it('should be a Set', () => {
            expect(EXCLUSION_WORD_SET instanceof Set).toBe(true);
        });

        it('should have same size as list', () => {
            expect(EXCLUSION_WORD_SET.size).toBe(EXCLUSION_WORD_LIST.length);
        });

        it('should enable O(1) lookups', () => {
            expect(EXCLUSION_WORD_SET.has('best')).toBe(true);
            expect(EXCLUSION_WORD_SET.has('cheap')).toBe(true);
            expect(EXCLUSION_WORD_SET.has('amazon')).toBe(true);
        });

        it('should not contain valid product terms', () => {
            expect(EXCLUSION_WORD_SET.has('beer')).toBe(false);
            expect(EXCLUSION_WORD_SET.has('bong')).toBe(false);
            expect(EXCLUSION_WORD_SET.has('yoga')).toBe(false);
            expect(EXCLUSION_WORD_SET.has('mat')).toBe(false);
        });

        it('should work for keyword filtering', () => {
            const keyword = 'best cheap beer bong';
            const words = keyword.split(' ');
            const filteredWords = words.filter(word => !EXCLUSION_WORD_SET.has(word));
            
            expect(filteredWords).toEqual(['beer', 'bong']);
        });
    });

    describe('Practical keyword filtering scenarios', () => {
        const filterKeyword = (keyword: string): string[] => {
            return keyword.toLowerCase()
                .split(/\s+/)
                .filter(word => word.length > 0 && !EXCLUSION_WORD_SET.has(word));
        };

        it('should filter out noise words from product keywords', () => {
            expect(filterKeyword('the best yoga mat for you')).toEqual(['yoga', 'mat']);
            expect(filterKeyword('buy new coffee maker on sale')).toEqual(['coffee', 'maker']);
        });

        it('should remove price-related terms', () => {
            expect(filterKeyword('cheap affordable beer bong')).toEqual(['beer', 'bong']);
        });

        it('should remove quantity terms', () => {
            expect(filterKeyword('water bottle 32 oz large size')).toEqual(['water', 'bottle', '32']);
        });

        it('should remove question words', () => {
            expect(filterKeyword('how to use beer bong')).toEqual(['use', 'beer', 'bong']);
        });

        it('should keep brand names that are not in exclusion list', () => {
            expect(filterKeyword('kong beer bong')).toEqual(['kong', 'beer', 'bong']);
            expect(filterKeyword('nike running shoes')).toEqual(['nike', 'running', 'shoes']);
        });

        it('should handle mixed case input', () => {
            const upperKeyword = 'THE BEST YOGA MAT';
            expect(filterKeyword(upperKeyword)).toEqual(['yoga', 'mat']);
        });

        it('should handle empty or whitespace strings', () => {
            expect(filterKeyword('')).toEqual([]);
            expect(filterKeyword('   ')).toEqual([]);
        });
    });
});
