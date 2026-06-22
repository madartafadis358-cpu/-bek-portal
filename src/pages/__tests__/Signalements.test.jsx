import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '../../context/AppContext.jsx';
import Signalements from '../Signalements.jsx';

function renderWithProviders(ui) {
  return render(
    <AppProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </AppProvider>
  );
}

describe('Signalements', () => {
  it('renders page title', () => {
    renderWithProviders(<Signalements />);
    expect(screen.getByText('Préoccupations & Signalements')).toBeTruthy();
  });

  it('renders search input', () => {
    renderWithProviders(<Signalements />);
    expect(screen.getByPlaceholderText(/Rechercher un signalement/)).toBeTruthy();
  });

  it('renders category filter', () => {
    renderWithProviders(<Signalements />);
    expect(screen.getByDisplayValue('Toutes les catégories')).toBeTruthy();
  });

  it('displays all signalements initially', async () => {
    renderWithProviders(<Signalements />);
    await waitFor(() => {
      expect(screen.getByText('Nid de poule sur la route principale')).toBeTruthy();
      expect(screen.getByText("Panne d'éclairage rue Ben Youcef")).toBeTruthy();
    });
  });

  it('filters signalements by search query', async () => {
    renderWithProviders(<Signalements />);
    await waitFor(() => {
      expect(screen.getByText("Panne d'éclairage rue Ben Youcef")).toBeTruthy();
    });
    const searchInput = screen.getByPlaceholderText(/Rechercher un signalement/);
    fireEvent.change(searchInput, { target: { value: 'éclairage' } });
    expect(screen.getByText("Panne d'éclairage rue Ben Youcef")).toBeTruthy();
    expect(screen.queryByText('Nid de poule sur la route principale')).toBeNull();
  });

  it('filters signalements by category', async () => {
    renderWithProviders(<Signalements />);
    await waitFor(() => {
      expect(screen.getByText('Absence de transport le week-end')).toBeTruthy();
    });
    const select = screen.getByDisplayValue('Toutes les catégories');
    fireEvent.change(select, { target: { value: 'Transport' } });
    expect(screen.getByText('Absence de transport le week-end')).toBeTruthy();
    expect(screen.queryByText('Nid de poule sur la route principale')).toBeNull();
  });

  it('shows empty state when no results', async () => {
    renderWithProviders(<Signalements />);
    await waitFor(() => {
      expect(screen.getByText('Nid de poule sur la route principale')).toBeTruthy();
    });
    const searchInput = screen.getByPlaceholderText(/Rechercher un signalement/);
    fireEvent.change(searchInput, { target: { value: 'zzzznotfound' } });
    expect(screen.getByText(/Aucun signalement/)).toBeTruthy();
  });

  it('opens and closes the form', () => {
    renderWithProviders(<Signalements />);
    fireEvent.click(screen.getByText('Signaler un problème'));
    expect(screen.getByPlaceholderText('Ex: Nid de poule sur la route')).toBeTruthy();
    fireEvent.click(screen.getByText('Fermer'));
    expect(screen.queryByPlaceholderText('Ex: Nid de poule sur la route')).toBeNull();
    expect(screen.getByText('Signaler un problème')).toBeTruthy();
  });

  it('submits a new signalement', async () => {
    renderWithProviders(<Signalements />);
    fireEvent.click(screen.getByText('Signaler un problème'));
    fireEvent.change(screen.getByPlaceholderText('Ex: Nid de poule sur la route'), { target: { value: 'Nouveau test' } });
    fireEvent.change(screen.getByPlaceholderText('Ex: Cité 5 Juillet'), { target: { value: 'Test quartier' } });
    fireEvent.change(screen.getByPlaceholderText(/Décrivez précisément/), { target: { value: 'Description test' } });
    fireEvent.click(screen.getByText('Soumettre le signalement'));
    await waitFor(() => {
      expect(screen.getByText(/a été soumis avec succès/)).toBeTruthy();
    });
  });

  it('validates required fields on submit', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderWithProviders(<Signalements />);
    fireEvent.click(screen.getByText('Signaler un problème'));
    const submitBtn = screen.getByText('Soumettre le signalement');
    const form = submitBtn.closest('form');
    fireEvent.submit(form);
    expect(alertSpy).toHaveBeenCalledWith('Veuillez remplir tous les champs obligatoires.');
    alertSpy.mockRestore();
  });

  it('renders vote buttons', async () => {
    renderWithProviders(<Signalements />);
    await waitFor(() => {
      expect(screen.getByText(/Soutenir \(24\)/)).toBeTruthy();
    });
  });
});
