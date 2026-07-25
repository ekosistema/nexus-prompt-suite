import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAIInference } from './useAIInference';
import { AppProvider } from '../contexts/AppContext';

// Mock del servicio de IA
vi.mock('../services/ai', () => ({
  aiService: {
    generate: vi.fn(),
  },
}));

import { aiService } from '../services/ai';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

describe('useAIInference SDET Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Phase 1: Happy Path ─────────────────────────────────────────────────
  it('Should successfully run inference and update messages (Happy Path)', async () => {
    // Simulamos respuesta válida de la IA
    (aiService.generate as any).mockResolvedValueOnce('Respuesta simulada del LLM');

    const { result } = renderHook(() => useAIInference(), { wrapper });

    // Estado inicial
    expect(result.current.isThinking).toBe(false);
    expect(result.current.messages).toHaveLength(0);

    // Acción
    await act(async () => {
      await result.current.runInference('Hola IA');
    });

    // Validacion posterior
    expect(result.current.isThinking).toBe(false);
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0]).toEqual({ role: 'user', content: 'Hola IA' });
    expect(result.current.messages[1]).toEqual({ role: 'assistant', content: 'Respuesta simulada del LLM' });
    expect(result.current.error).toBeNull();
  });

  // ── Phase 2: Hostile Path ───────────────────────────────────────────────
  it('Should gracefully recover from a network layout / IPC error (Hostile Path)', async () => {
    // Simulamos que el Backend falla (Tauri bridge caído o error 500)
    (aiService.generate as any).mockRejectedValueOnce(new Error('Tauri IPC failed'));

    const { result } = renderHook(() => useAIInference(), { wrapper });

    await act(async () => {
      await result.current.runInference('Prompt Peligroso', false);
    });

    // Validamos tolerancia a fallos
    expect(result.current.isThinking).toBe(false);
    expect(result.current.messages).toHaveLength(0); // No debe inyectar la respuesta
    expect(result.current.error).toBe('Tauri IPC failed');
  });

  it('Should handle Title parsing gracefully when failing', async () => {
    (aiService.generate as any).mockRejectedValueOnce(new Error('Title Gen failed'));

    const { result } = renderHook(() => useAIInference(), { wrapper });

    let title: string = '';
    await act(async () => {
      title = await result.current.generateTitle([{ role: 'user', content: 'x' }]);
    });

    // Debe devolver el fallback y no crashear
    expect(title).toBe('New Chat');
  });

  // ── Phase 3: Mocks & Performance ─────────────────────────────────────────
  it('Should isolate calls immediately without hitting real endpoints (Mock Constraint)', async () => {
    (aiService.generate as any).mockImplementationOnce(async () => {
      return new Promise((resolve) => setTimeout(() => resolve('Rápido'), 10)); // 10ms
    });

    const { result } = renderHook(() => useAIInference(), { wrapper });

    const startTime = performance.now();
    await act(async () => {
      await result.current.runInference('Perf Test', false);
    });
    const duration = performance.now() - startTime;

    // Verificamos que no dependa de un LLM real (debe ser muy rápido via Mocks)
    expect(duration).toBeLessThan(100);
    expect(aiService.generate).toHaveBeenCalledTimes(1);
    expect(result.current.result).toBe('Rápido');
  });
});
