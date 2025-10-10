chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.type === 'engagement') {
        const {tweetText} = request;
        (async () => {
            try {   
                const result = await chrome.storage.sync.get(['userContext'])
                const userContext = result.userContext
                const postresponse = await fetch('http://localhost:5001/score', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userContext : userContext || {},
                        tweetText : tweetText || ''
                    })
                })
                const data = await postresponse.json()
                if(data.success) {
                    sendResponse({metrics:data.metrics})
                } else {
                    sendResponse({error : data.error || 'error from LLM'})
                } 
            } catch (error) {
                sendResponse({error : 'Failed to connect to LLM'})
            }
        })()
        return true
    }
})