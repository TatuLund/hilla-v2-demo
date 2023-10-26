import { describe, it, expect } from 'vitest';
import {sum } from '../sum';

describe('Summing', async () => {
    it('1+2 = 3', async () => {
        expect(sum(1, 2)).toBe(3);
    });
    it('1+0 = 1', async () => {
        expect(sum(1, 0)).toBe(1);
    });
    it('1+(-3) = -2', async () => {
        expect(sum(1, -3)).toBe(-2);
    });
});
