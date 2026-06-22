import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '../../context/AppContext.jsx';
import Navbar from '../Navbar.jsx';

function renderWithProviders(ui, { initialEntries = ['/'] } = {}) {
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </AppProvider>
  );
}

describe('Navbar', () => {
  it('renders logo and navigation links', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('BEK')).toBeTruthy();
    expect(screen.getByText('Accueil')).toBeTruthy();
    expect(screen.getByText('Signalements')).toBeTruthy();
    expect(screen.getByText('Propositions')).toBeTruthy();
    expect(screen.getByText('Projets')).toBeTruthy();
    expect(screen.getByText('Entraide')).toBeTruthy();
    expect(screen.getByText('Contact')).toBeTruthy();
  });

  it('shows Connexion and Rejoindre buttons when logged out', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('Connexion')).toBeTruthy();
    expect(screen.getByText('Rejoindre')).toBeTruthy();
  });

  it('toggles mobile menu on hamburger click', () => {
    renderWithProviders(<Navbar />);
    const hamburger = screen.getByLabelText('Menu');
    fireEvent.click(hamburger);
    const rejoindreBtns = screen.getAllByText('Rejoindre');
    expect(rejoindreBtns.length).toBeGreaterThanOrEqual(2);
    fireEvent.click(hamburger);
    expect(screen.getAllByText('Rejoindre').length).toBe(1);
  });

  it('closes mobile menu on navigation', () => {
    renderWithProviders(<Navbar />, { initialEntries: ['/signalements'] });
    const hamburger = screen.getByLabelText('Menu');
    fireEvent.click(hamburger);
    const rejoindreBtns = screen.getAllByText('Rejoindre');
    expect(rejoindreBtns.length).toBeGreaterThanOrEqual(2);
  });

  it('highlights active link', () => {
    renderWithProviders(<Navbar />, { initialEntries: ['/signalements'] });
    const activeLink = screen.getByText('Signalements');
    expect(activeLink.className).toContain('active');
  });
});
