import { describe, it, expect, vi, beforeEach } from 'vitest';

const invoke = vi.fn();
vi.mock('@tauri-apps/api/core', () => ({ invoke: (...a: unknown[]) => invoke(...a) }));

async function freshModule() {
  vi.resetModules();
  return await import('./secureStorage');
}

describe('secureStorage', () => {
  beforeEach(() => {
    invoke.mockReset();
    localStorage.clear();
  });

  it('guarda la clave AES en el llavero y la reutiliza (una sola clave por sesión)', async () => {
    let stored = '';
    invoke.mockImplementation(async (cmd: string, args: { value?: string }) => {
      if (cmd === 'secure_storage_get') return stored;
      if (cmd === 'secure_storage_set') { stored = args.value!; return true; }
      throw new Error('unexpected');
    });
    const { secureSetItem, secureGetItem } = await freshModule();
    // Cargas concurrentes al arrancar: no deben generar claves distintas.
    await Promise.all([secureSetItem('a', { n: 1 }), secureSetItem('b', { n: 2 })]);
    expect(await secureGetItem('a')).toEqual({ n: 1 });
    expect(await secureGetItem('b')).toEqual({ n: 2 });
    expect(invoke.mock.calls.filter(c => c[0] === 'secure_storage_set')).toHaveLength(1);
    expect(localStorage.getItem('a')).not.toContain('"n"'); // cifrado, no JSON en claro
  });

  it('si el llavero falla NO genera ni sobrescribe la clave', async () => {
    invoke.mockRejectedValue('keychain locked');
    const { secureSetItem } = await freshModule();
    await expect(secureSetItem('a', 1)).rejects.toBeDefined();
    expect(invoke.mock.calls.some(c => c[0] === 'secure_storage_set')).toBe(false);
    expect(localStorage.getItem('a')).toBeNull();
  });
});
