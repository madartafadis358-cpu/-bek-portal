import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../Footer.jsx';

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('Footer', () => {
  it('renders brand and description', () => {
    renderWithRouter(<Footer />);
    expect(screen.getAllByText('Portail Citoyen').length).toBeGreaterThan(0);
    expect(screen.getByText(/Plateforme participative/)).toBeTruthy();
  });

  it('renders navigation links', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText('Accueil')).toBeTruthy();
    expect(screen.getByText('Signalements')).toBeTruthy();
    expect(screen.getByText('Projets Citoyens')).toBeTruthy();
  });

  it('renders contact information', () => {
    renderWithRouter(<Footer />);
    const bekTexts = screen.getAllByText(/Bordj El Kiffan/);
    expect(bekTexts.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/b\.mourad\.computer@gmail\.com/)).toBeTruthy();
  });

  it('renders admin info', () => {
    renderWithRouter(<Footer />);
    const adminNames = screen.getAllByText('Brik Chaouche Mourad');
    expect(adminNames.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Créateur/)).toBeTruthy();
  });

  it('renders copyright with current year', () => {
    renderWithRouter(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(year.toString()))).toBeTruthy();
  });
});
