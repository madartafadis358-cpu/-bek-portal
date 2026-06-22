import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '../../context/AppContext.jsx';
import Home from '../Home.jsx';

function renderWithProviders(ui) {
  return render(
    <AppProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </AppProvider>
  );
}

describe('Home', () => {
  it('renders hero section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/La voix des citoyens/)).toBeTruthy();
    expect(screen.getAllByText(/Bordj El Kiffan/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders CTA buttons', () => {
    renderWithProviders(<Home />);
    const signalerBtns = screen.getAllByText('Signaler un problème');
    expect(signalerBtns.length).toBeGreaterThanOrEqual(1);
    const proposerBtns = screen.getAllByText('Proposer une idée');
    expect(proposerBtns.length).toBeGreaterThanOrEqual(1);
  });

  it('renders admin card', () => {
    renderWithProviders(<Home />);
    const adminNames = screen.getAllByText('Brik Chaouche Mourad');
    expect(adminNames.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Créateur/)).toBeTruthy();
  });

  it('renders stats section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('Membres')).toBeTruthy();
    expect(screen.getByText('Bénévoles')).toBeTruthy();
    expect(screen.getByText('Projets actifs')).toBeTruthy();
  });

  it('renders module cards', () => {
    renderWithProviders(<Home />);
    const signalementCards = screen.getAllByText('Signalements');
    expect(signalementCards.length).toBeGreaterThanOrEqual(2);
    const propositionCards = screen.getAllByText('Propositions');
    expect(propositionCards.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Projets Citoyens')).toBeTruthy();
    expect(screen.getByText('Entraide')).toBeTruthy();
  });

  it('renders recent signalements', async () => {
    renderWithProviders(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Nid de poule sur la route principale')).toBeTruthy();
      expect(screen.getByText(/Grande route endommagée/)).toBeTruthy();
    });
  });

  it('renders top propositions', async () => {
    renderWithProviders(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Installer des caméras de surveillance dans les parcs')).toBeTruthy();
    });
  });

  it('renders active projects with progress bars', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('Réhabilitation du parc municipal')).toBeTruthy();
    expect(screen.getByText('65%')).toBeTruthy();
  });

  it('renders community CTA section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/Rejoignez la communauté/)).toBeTruthy();
  });
});
