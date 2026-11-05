import { describe, it, expect, vi } from 'vitest';
import { stripMarkdownFences, safeLog } from './utils';

describe('stripMarkdownFences', () => {
  it('quita solo las vallas externas y no toca el contenido', () => {
    const text = '```markdown\nSi a < b & c > d usa <instrucciones>x</instrucciones>\n```';
    expect(stripMarkdownFences(text)).toBe('Si a < b & c > d usa <instrucciones>x</instrucciones>');
  });
  it('respeta bloques de código internos', () => {
    const text = 'Ejemplo:\n```js\nconst a = 1;\n```\nFin';
    expect(stripMarkdownFences(text)).toBe(text);
  });
});

describe('safeLog', () => {
  it.each([
    'sk-proj-abcdefghijklmnopqrstuvwxyz0123456789',
    'gsk_abcdefghijklmnopqrstuvwxyz0123',
    'AIzaSyA1234567890abcdefghijklmnopqrstuv',
    'Bearer abc.def.ghi',
  ])('redacta %s', secret => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    safeLog('error', `fallo con ${secret}`, { apiKey: secret });
    const printed = JSON.stringify(spy.mock.calls);
    expect(printed).not.toContain(secret.replace('Bearer ', ''));
    spy.mockRestore();
  });
});
