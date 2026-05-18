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

// Mock Service Worker registration
Object.defineProperty(navigator, 'serviceWorker', {
  writable: true,
  value: {
    register: vi.fn().mockResolvedValue({}),
    ready: Promise.resolve({ sync: { register: vi.fn() } })
  }
});

// Mock Background Sync API
Object.defineProperty(window, 'SyncManager', {
  writable: true,
  value: function() {}
});

// Mock IndexedDB
const mockIndexedDB = {
  open: vi.fn().mockImplementation(() => ({
    onsuccess: null,
    onerror: null,
    result: {
      createObjectStore: vi.fn(),
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          put: vi.fn().mockResolvedValue({}),
          getAll: vi.fn().mockResolvedValue([])
        })
      })
    }
  }))
};

Object.defineProperty(global, 'indexedDB', {
  writable: true,
  value: mockIndexedDB
});

describe('ParentDashboard PWA Features', () => {
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

    // Mock navigator.onLine
    Object.defineProperty(global.navigator, 'onLine', {
      value: true,
      writable: true
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('handles offline status and sync', async () => {
    // Çevrimdışı yap
    global.navigator.onLine = false;
    render(<ParentDashboard />);

    // Çevrimdışı bildirimi kontrol et
    expect(screen.getByText(/Çevrimdışı modda çalışıyorsunuz/i)).toBeInTheDocument();
    expect(screen.getByText('Senkronize ediliyor...')).toBeInTheDocument();

    // Çevrimiçi yap ve senkronizasyonu bekle
    global.navigator.onLine = true;
    window.dispatchEvent(new Event('online'));

    await waitFor(() => {
      expect(screen.getByText('Senkronize edildi')).toBeInTheDocument();
    });
  });

  it('requests and handles notification permissions', async () => {
    render(<ParentDashboard />);
    const button = screen.getByText('Bildirimleri Etkinleştir');
    fireEvent.click(button);

    // Bildirim izni istendiğini kontrol et
    expect(Notification.requestPermission).toHaveBeenCalled();

    // Bildirim izni verildiğinde test bildirimi göster
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

  it('registers service worker and handles background sync', async () => {
    render(<ParentDashboard />);

    // Service worker kaydının yapıldığını kontrol et
    await waitFor(() => {
      expect(navigator.serviceWorker.register).toHaveBeenCalled();
    });

    // Background sync kaydının yapıldığını kontrol et
    const serviceWorker = await navigator.serviceWorker.ready;
    expect(serviceWorker.sync.register).toHaveBeenCalled();
  });

  it('stores data in IndexedDB for offline use', async () => {
    render(<ParentDashboard />);

    // IndexedDB açıldığını kontrol et
    expect(mockIndexedDB.open).toHaveBeenCalled();

    // Verilerin saklandığını kontrol et
    const db = mockIndexedDB.open().result;
    const transaction = db.transaction('words', 'readwrite');
    const store = transaction.objectStore('words');

    expect(store.put).toHaveBeenCalled();
    expect(store.getAll).toHaveBeenCalled();
  });
});