// Type definitions for Electron IPC API
interface ElectronAPI {
    settings: {
        get: () => Promise<any>;
        save: (data: any) => Promise<void>;
    };
}

// Extend Window interface
declare global {
    interface Window {
        api: ElectronAPI;
    }
}

// Typed wrapper for Electron API
export const electronAPI = {
    settings: {
        get: async (): Promise<any> => {
            try {
                return await window.api.settings.get();
            } catch (error) {
                console.error('Error getting settings:', error);
                throw new Error('Failed to load settings');
            }
        },
        save: async (data: any): Promise<void> => {
            try {
                await window.api.settings.save(data);
            } catch (error) {
                console.error('Error saving settings:', error);
                throw new Error('Failed to save settings');
            }
        }
    }
};
