export interface metrics { 
    likes : number
    replies : number
    reposts : number
    views : number
}

class BackendBase { 
    private storage(): boolean {
        return typeof chrome !== 'undefined' && Boolean(chrome.storage?.sync)
    }
    //save context
    async saveSettings(content : string): Promise<boolean> {
        if(!this.storage()) return false
        await chrome.storage.sync.set({userContext : content})
        return true
    }
    //get context
    async getSettings(): Promise<string> {
        if(!this.storage()) return ''
        const data = await chrome.storage.sync.get(['userContext'])
        return data.userContext || ''
    }
    //save tweet
    async saveTweet(tweet : string): Promise<boolean> {
        if(!this.storage()) return false
        await chrome.storage.sync.set({lastTweetText : tweet})
        return true
    }
    //get tweet
    async getTweet(): Promise<string> {
        if(!this.storage()) return ''
        const data = await chrome.storage.sync.get(['lastTweetText'])
        return data.lastTweetText || ''
    }
    //engagement
    async engagement(tweetText : string): Promise<metrics | null> {
        try {
            const data = await chrome.runtime.sendMessage({ type: 'engagement', tweetText })
            if (data?.metrics) await this.saveMetrics(data.metrics)
            return data?.metrics || null
        } catch(error) {
            return null
        }        
    }
    //save metrics
    async saveMetrics(content : metrics): Promise<boolean> {
        if(!this.storage()) return false
        await chrome.storage.sync.set({finalMetrics : content})
        return true
    }
    //get metrics
    async getMetrics(): Promise<metrics | null> {
        if(!this.storage()) return null
        const data = await chrome.storage.sync.get(['finalMetrics'])
        return data.finalMetrics || null
    }
}

export const backend = new BackendBase()