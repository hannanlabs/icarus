export interface UserSettings {
  llmApiKey: string;
  twitterUsername: string;
}

class BackendService {
  private isStorageAvailable(): boolean {
    return typeof chrome !== 'undefined' && !!chrome.storage?.sync;
  }

  async getSettings(): Promise<UserSettings> {
    if (this.isStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.sync.get(['llmApiKey', 'twitterUsername'], (result) => {
          resolve({
            llmApiKey: result.llmApiKey || '',
            twitterUsername: result.twitterUsername || '',
          });
        });
      });
    } else {
      return { llmApiKey: '', twitterUsername: '' };
    }
  }

  async saveApiKey(apiKey: string): Promise<boolean> {
    if (this.isStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.sync.set({ llmApiKey: apiKey }, () => {
          resolve(true);
        });
      });
    } else {
      console.log('Dev mode - API Key saved:', apiKey);
      return true;
    }
  }

  async saveTwitterUsername(username: string): Promise<boolean> {
    const cleanUsername = username.replace('@', '');

    if (this.isStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.sync.set({ twitterUsername: cleanUsername }, () => {
          resolve(true);
        });
      });
    } else {
      console.log('Dev mode - Twitter username saved:', cleanUsername);
      return true;
    }
  }
}

export const backend = new BackendService();