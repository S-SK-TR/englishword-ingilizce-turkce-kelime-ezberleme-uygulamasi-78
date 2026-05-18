import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ParentDashboard } from '../ParentDashboard';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useStore } from '@/core/store/useStore';

// Mock Zustand store
vi.mock('@/core/store/useStore', () => ({
  default: vi.fn()
}));

// Mock Notification API
Object.defineProperty(global, 'Notification', {
  writable: true,
  value: {
    permission: 'default',
    requestPermission: vi.fn().mockResolvedValue('granted')
  }
});

describe('ParentDashboard Notification Features', () => {
  beforeEach(() => {
    // Mock store verisi
    useStore.mockReturnValue({
      game: {
        completedWords: [
          { english: 'apple', turkish: 'elma' },
          { english: 'book', turkish: 'kitap' },
          { english: 'house', turkish: 'ev' }
        ]
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows notification permission request button when permission is default', () => {
    Notification.permission = 'default';
    render(<ParentDashboard />);
    expect(screen.getByText('Bildirimleri Etkinleştir')).toBeInTheDocument();
  });

  it('shows schedule reminder button when notifications are granted', () => {
    Notification.permission = 'granted';
    render(<ParentDashboard />);
    expect(screen.getByText('Hatırlatıcı Planla')).toBeInTheDocument();
  });

  it('shows disabled button when notifications are denied', () => {
    Notification.permission = 'denied';
    render(<ParentDashboard />);
    const button = screen.getByText('Bildirimler Engellendi');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('requests notification permission when button is clicked', async () => {
    Notification.permission = 'default';
    render(<ParentDashboard />);
    const button = screen.getByText('Bildirimleri Etkinleştir');
    fireEvent.click(button);
    expect(Notification.requestPermission).toHaveBeenCalled();
  });

  it('shows test notification after permission is granted', async () => {
    Notification.permission = 'default';
    render(<ParentDashboard />);
    const button = screen.getByText('Bildirimleri Etkinleştir');
    fireEvent.click(button);

    // Bildirim izni verildi olarak ayarla
    Notification.permission = 'granted';
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Bildirimler etkinleştirildi!')).toBeInTheDocument();
    });
  });

  it('schedules study reminders when notifications are enabled', async () => {
    // Bildirim izni verildi olarak ayarla
    Notification.permission = 'granted';
    render(<ParentDashboard />);

    // Bildirim planlama butonunu bul ve tıkla
    const scheduleButton = screen.getByText('Hatırlatıcı Planla');
    fireEvent.click(scheduleButton);

    // Bildirimlerin planlandığını doğrula
    await waitFor(() => {
      expect(screen.getByText('Öğrenmeye devam et!')).toBeInTheDocument();
    });
  });
});