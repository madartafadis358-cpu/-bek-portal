import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppProvider, useApp } from '../context/AppContext.jsx';

function wrapper({ children }) {
  return <AppProvider>{children}</AppProvider>;
}

describe('AppContext', () => {
  it('provides initial state', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.signalements).toHaveLength(4);
    });
    expect(result.current.state.propositions).toHaveLength(3);
    expect(result.current.state.projets).toHaveLength(3);
    expect(result.current.state.entraide).toHaveLength(3);
    expect(result.current.state.actualites).toHaveLength(3);
    expect(result.current.state.user).toBeNull();
  });

  it('handles LOGIN action', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.dispatch({ type: 'LOGIN', payload: { name: 'Test', role: 'user' } }));
    expect(result.current.state.user).toEqual({ name: 'Test', role: 'user' });
  });

  it('handles LOGOUT action', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.dispatch({ type: 'LOGIN', payload: { name: 'Test', role: 'user' } }));
    act(() => result.current.dispatch({ type: 'LOGOUT' }));
    expect(result.current.state.user).toBeNull();
  });

  it('handles ADD_SIGNALEMENT action', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.signalements).toHaveLength(4);
    });
    const signalement = { titre: 'Test problème', categorie: 'Voirie et routes', quartier: 'Centre', description: 'Desc' };
    act(() => result.current.dispatch({ type: 'ADD_SIGNALEMENT', payload: signalement }));
    expect(result.current.state.signalements).toHaveLength(5);
    expect(result.current.state.signalements[0].titre).toBe('Test problème');
    expect(result.current.state.signalements[0].statut).toBe('Nouveau');
    expect(result.current.state.stats.signalements).toBe(5);
  });

  it('handles VOTE_SIGNALEMENT action', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.signalements).toHaveLength(4);
    });
    act(() => result.current.dispatch({ type: 'VOTE_SIGNALEMENT', payload: 1 }));
    const s = result.current.state.signalements.find(s => s.id === 1);
    expect(s.votes).toBe(25);
  });

  it('handles ADD_PROPOSITION action', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.propositions).toHaveLength(3);
    });
    act(() => result.current.dispatch({ type: 'ADD_PROPOSITION', payload: { titre: 'Nouvelle idée', categorie: 'Transport', description: 'Desc' } }));
    expect(result.current.state.propositions).toHaveLength(4);
    expect(result.current.state.propositions[0].votes).toBe(0);
    expect(result.current.state.stats.propositions).toBe(4);
  });

  it('handles VOTE_PROPOSITION action', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.propositions).toHaveLength(3);
    });
    act(() => result.current.dispatch({ type: 'VOTE_PROPOSITION', payload: 1 }));
    const p = result.current.state.propositions.find(p => p.id === 1);
    expect(p.votes).toBe(88);
  });

  it('handles ADD_ENTRAIDE action', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.entraide).toHaveLength(3);
    });
    act(() => result.current.dispatch({ type: 'ADD_ENTRAIDE', payload: { type: 'Bénévolat', titre: 'Aide test', description: 'Desc', contact: 'test@test.com' } }));
    expect(result.current.state.entraide).toHaveLength(4);
    expect(result.current.state.entraide[0].titre).toBe('Aide test');
  });

  it('throws when useApp is used outside provider', () => {
    expect(() => renderHook(() => useApp())).toThrow('useApp must be used within AppProvider');
  });

  it('handles unknown action type', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.signalements).toHaveLength(4);
    });
    act(() => result.current.dispatch({ type: 'UNKNOWN' }));
    expect(result.current.state.signalements).toHaveLength(4);
  });
});
