export interface UserSettings {
  llmApiKey: string;
  twitterUsername: string;
  twitterBearerToken: string;
  cachedTwitterData?: TwitterUserData;
}

export interface TwitterUserData {
  id: string;
  name: string;
  username: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
}

class BackendService {
  private isStorageAvailable(): boolean {
    return typeof chrome !== 'undefined' && !!chrome.storage?.sync;
  }

  async getSettings(): Promise<UserSettings> {
    if (this.isStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.sync.get(['llmApiKey', 'twitterUsername', 'twitterBearerToken', 'cachedTwitterData'], (result) => {
          resolve({
            llmApiKey: result.llmApiKey || '',
            twitterUsername: result.twitterUsername || '',
            twitterBearerToken: result.twitterBearerToken || '',
            cachedTwitterData: result.cachedTwitterData || undefined,
          });
        });
      });
    } else {
      return { llmApiKey: '', twitterUsername: '', twitterBearerToken: '' };
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

  async saveBearerToken(token: string): Promise<boolean> {
    if (this.isStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.sync.set({ twitterBearerToken: token }, () => {
          resolve(true);
        });
      });
    } else {
      console.log('Dev mode - Bearer token saved:', token);
      return true;
    }
  }

  async fetchTwitterUserData(username: string, bearerToken: string): Promise<TwitterUserData | null> {
    try {
      const cleanUsername = username.replace('@', '');

      return new Promise((resolve) => {
        chrome.runtime.sendMessage(
          { action: 'fetchTwitterUser', username: cleanUsername, bearerToken },
          async (response) => {
            if (response?.success) {
              await this.cacheTwitterData(response.data);
              resolve(response.data);
            } else {
              console.error('Error:', response?.error);
              resolve(null);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error fetching Twitter data:', error);
      return null;
    }
  }

  async cacheTwitterData(data: TwitterUserData): Promise<boolean> {
    if (this.isStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.sync.set({ cachedTwitterData: data }, () => {
          resolve(true);
        });
      });
    } else {
      console.log('Dev mode - Twitter data cached:', data);
      return true;
    }
  }
}

export const backend = new BackendService();