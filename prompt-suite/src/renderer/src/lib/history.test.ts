import { describe, it, expect } from 'vitest';
import { HistoryEntry, pruneHistory, upsertEntry, currentText, deriveTitle } from './history';

const mk = (id: string, updatedAt: number, favorite = false): HistoryEntry => ({
  id, module: 'genesis', title: id, createdAt: updatedAt, updatedAt, favorite,
  basePrompt: 'base', versions: [], activeVersion: -1, snapshot: {},
});

describe('history helpers', () => {
  it('upsert reemplaza por id y añade lo nuevo al principio', () => {
    const a = mk('a', 1);
    const list = upsertEntry([a], { ...a, title: 'nuevo', updatedAt: 5 });
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe('nuevo');
    expect(upsertEntry(list, mk('b', 9))[0].id).toBe('b');
  });

  it('prune respeta favoritos y recorta lo más antiguo', () => {
    const list = [mk('old-fav', 1, true), mk('x', 2), mk('y', 3), mk('z', 4)];
    const out = pruneHistory(list, 2).map(e => e.id);
    expect(out).toContain('old-fav');
    expect(out).toContain('z');
    expect(out).toHaveLength(2);
  });

  it('currentText devuelve la versión activa o la base', () => {
    const e = { ...mk('a', 1), versions: [{ label: 'v1', text: 'ia' }] };
    expect(currentText({ ...e, activeVersion: 0 })).toBe('ia');
    expect(currentText({ ...e, activeVersion: -1 })).toBe('base');
  });

  it('deriveTitle usa el campo del formulario o la primera línea', () => {
    expect(deriveTitle({ 'suite.genesis': { objective: 'App de recetas' } }, 'x', 'f')).toBe('App de recetas');
    expect(deriveTitle({}, '### ROL\nActúa como experto', 'f')).toBe('Actúa como experto');
  });
});

import { parseImport } from './history';

describe('parseImport', () => {
  it('acepta el formato exportado y descarta entradas inválidas', () => {
    const good = { id: 'a', module: 'genesis', basePrompt: 'hola', versions: [{ label: 'v1', text: 'x' }], activeVersion: 0 };
    const out = parseImport({ version: 1, entries: [good, { id: 5 }, null, 'x'] });
    expect(out).toHaveLength(1);
    expect(out[0].versions).toHaveLength(1);
    expect(out[0].activeVersion).toBe(0);
  });

  it('normaliza versión activa fuera de rango y rechaza basura', () => {
    const e = { id: 'a', module: 'dev', basePrompt: 'p', versions: [], activeVersion: 7 };
    expect(parseImport([e])[0].activeVersion).toBe(-1);
    expect(parseImport('nope')).toEqual([]);
    expect(parseImport({})).toEqual([]);
  });
});
