import { describe, it, expect } from 'vitest';
import { findOrphanVars } from './promptValidators';

describe('findOrphanVars', () => {
    it('detecta placeholders sin sustituir y los devuelve únicos y ordenados', () => {
        expect(findOrphanVars('Hola {{TOPIC}} y {{AUDIENCE}}')).toEqual(['TOPIC', 'AUDIENCE']);
    });

    it('excluye LANG_OUTPUT, que se reemplaza aparte', () => {
        expect(findOrphanVars('sin variables{{LANG_OUTPUT}}ok')).toEqual([]);
    });

    it('deduplica y preserva el orden de aparición', () => {
        expect(findOrphanVars('{{B}}, {{A}}, {{B}}')).toEqual(['B', 'A']);
    });

    it('devuelve [] cuando no hay placeholders', () => {
        expect(findOrphanVars('prompt sin variables')).toEqual([]);
        expect(findOrphanVars('')).toEqual([]);
    });
});