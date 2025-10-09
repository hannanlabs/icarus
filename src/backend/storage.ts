export interface UserSettings {
  userContext: string;
}

export interface ViralityMetrics {
  estimatedReplies: number;
  estimatedReposts: number;
  estimatedLikes: number;
  estimatedViews: number;
}

class BackendService {
  private isStorageAvailable(): boolean {
    return typeof chrome !== 'undefined' && !!chrome.storage?.sync;
  }

  async getSettings(): Promise<UserSettings> {
    if (this.isStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.sync.get(['userContext'], (result) => {
          resolve({
            userContext: result.userContext || '',
          });
        });
      });
    } else {
      return { userContext: '' };
    }
  }


    async calculateViralityScore(tweetText: string): Promise<ViralityMetrics | null> {
    try {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage(
          { action: 'calculateViralityScore', tweetText },
          async (response) => {
            if (response?.success) {
              const metrics = response.metrics as ViralityMetrics;
              await this.saveLatestMetrics(metrics);
              resolve(metrics);
            } else {
              console.error('OpenAI scoring error:', response?.error);
              resolve(null);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error calculating virality score:', error);
      return null;
    }
  }

  async saveLatestMetrics(metrics: ViralityMetrics): Promise<boolean> {
    if (this.isStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.sync.set({ latestMetrics: metrics }, () => {
          resolve(true);
        });
      });
    } else {
      console.log('Dev mode - Latest metrics saved:', metrics);
      return true;
    }
  }

  async getLatestMetrics(): Promise<ViralityMetrics | null> {
    if (this.isStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.sync.get(['latestMetrics'], (result) => {
          resolve(result.latestMetrics || null);
        });
      });
    } else {
      return null;
    }
  }

  async saveLastTweetText(text: string): Promise<boolean> {
    if (this.isStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.sync.set({ lastTweetText: text }, () => resolve(true));
      });
    } else {
      console.log('Dev mode - Last tweet text saved:', text);
      return true;
    }
  }

  async getLastTweetText(): Promise<string> {
    if (this.isStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.sync.get(['lastTweetText'], (result) => {
          resolve(result.lastTweetText || '');
        });
      });
    } else {
      return '';
    }
  }

  async saveUserContext(context: string): Promise<boolean> {
    if (this.isStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.sync.set({ userContext: context }, () => {
          resolve(true);
        });
      });
    } else {
      console.log('Dev mode - User context saved:', context);
      return true;
    }
  }
}

export const backend = new BackendService();
