import { SavedConfig, ViewerSettings } from '../types';

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'quleep_3d_configs';

export const mockBackend = {
  /**
   * Simulates uploading a model file.
   * In a real app, this would POST multipart/form-data to AWS S3/Backend.
   * Here, we create a local Blob URL.
   */
  uploadModel: async (file: File): Promise<string> => {
    console.log(`[Mock Backend] Uploading file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    await delay(1500); // Fake upload time
    return URL.createObjectURL(file);
  },

  /**
   * Simulates saving the viewer configuration.
   */
  saveSettings: async (payload: { modelUrl: string; settings: ViewerSettings }): Promise<SavedConfig> => {
    console.log('[Mock Backend] Saving configuration...', payload);
    await delay(800);

    const newConfig: SavedConfig = {
      id: Math.random().toString(36).substring(2, 10),
      timestamp: Date.now(),
      modelUrl: payload.modelUrl,
      settings: payload.settings
    };

    // Persist to localStorage
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.push(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    return newConfig;
  },

  /**
   * Simulates fetching a saved configuration by ID.
   */
  fetchSettings: async (id: string): Promise<SavedConfig | null> => {
    console.log(`[Mock Backend] Fetching config ${id}...`);
    await delay(600);

    const existing: SavedConfig[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const config = existing.find(c => c.id === id);

    return config || null;
  }
};
