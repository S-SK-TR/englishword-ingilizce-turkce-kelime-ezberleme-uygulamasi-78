import { render, screen, waitFor } from '@testing-library/react';
import { ParentDashboard } from '../ParentDashboard';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useStore } from '@/core/store/useStore';

// Mock Zustand store
vi.mock('@/core/store/useStore', () => ({
  default: vi.fn()
}));

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

describe('ParentDashboard Background Sync Features', () => {
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

  it('registers service worker for background sync', async () => {
    render(<ParentDashboard />);

    // Service worker kaydının yapıldığını kontrol et
    await waitFor(() => {
      expect(navigator.serviceWorker.register).toHaveBeenCalled();
    });
  });

  it('registers background sync when service worker is ready', async () => {
    render(<ParentDashboard />);

    // Service worker hazır olduğunda background sync kaydının yapıldığını kontrol et
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

  it('shows sync status when going offline', async () => {
    // Çevrimdışı yap
    global.navigator.onLine = false;
    render(<ParentDashboard />);

    // Çevrimdışı bildirimi kontrol et
    expect(screen.getByText(/Çevrimdışı modda çalışıyorsunuz/i)).toBeInTheDocument();
    expect(screen.getByText('Senkronize ediliyor...')).toBeInTheDocument();
  });

  it('shows sync completed status when coming back online', async () => {
    // Çevrimdışı yap
    global.navigator.onLine = false;
    render(<ParentDashboard />);

    // Çevrimiçi yap ve senkronizasyonu bekle
    global.navigator.onLine = true;
    window.dispatchEvent(new Event('online'));

    await waitFor(() => {
      expect(screen.getByText('Senkronize edildi')).toBeInTheDocument();
    });
  });
});