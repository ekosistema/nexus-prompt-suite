import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSessionState } from './useSessionState';

describe('useSessionState', () => {
  it('conserva el valor al desmontar y volver a montar', () => {
    const first = renderHook(() => useSessionState('test.key', { a: 1 }));
    act(() => first.result.current[1]({ a: 2 }));
    first.unmount();

    const second = renderHook(() => useSessionState('test.key', { a: 1 }));
    expect(second.result.current[0]).toEqual({ a: 2 });
  });

  it('acepta actualizaciones funcionales', () => {
    const { result } = renderHook(() => useSessionState('test.counter', 0));
    act(() => result.current[1](prev => prev + 5));
    expect(result.current[0]).toBe(5);
  });
});
