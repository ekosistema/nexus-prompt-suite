import { describe, it, expect } from 'vitest';
import { collectOrphanVars } from './orphanUtils';

describe('collectOrphanVars', () => {
    it('detecta placeholders introducidos por la IA en la salida optimizada (caso real {{tema}}, {{audience}})', () => {
        const aiOutput = '# Prompt\n\n1. Define el {{tema}} con claridad.\n2. Describe tu {{audience}} objetivo.';
        expect(collectOrphanVars('', aiOutput)).toEqual(['tema', 'audience']);
    });

    it('unifica huérfanos del estático y los de la IA sin duplicados', () => {
        const staticPrompt = 'Reescribe cubriendo {{TOPIC}}';
        const aiOutput = 'Cubre {{TOPIC}} para tu {{audience}}';
        expect(collectOrphanVars(staticPrompt, aiOutput)).toEqual(['TOPIC', 'audience']);
    });

    it('devuelve solo los huérfanos del estático cuando no hay salida de IA', () => {
        expect(collectOrphanVars('cuida {{X}}', null)).toEqual(['X']);
        expect(collectOrphanVars('cuida {{X}}', '')).toEqual(['X']);
    });

    it('excluye LANG_OUTPUT en ambas fuentes', () => {
        expect(collectOrphanVars('{{LANG_OUTPUT}} {{TOPIC}}', 'responde con {{LANG_OUTPUT}} y {{tema}}')).toEqual(['TOPIC', 'tema']);
    });

    it('devuelve [] cuando no hay placeholders sin rellenar', () => {
        expect(collectOrphanVars('', '')).toEqual([]);
        expect(collectOrphanVars('sin variables', 'texto limpio sin dobles llaves')).toEqual([]);
    });
});