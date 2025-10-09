chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.type === 'engagement') {
    const { tweetText } = request;

    chrome.storage.sync.get(['userContext'], async (result) => {
      const userContext = result.userContext;

      try {
        const resp = await fetch('http://localhost:5001/score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tweetText: tweetText || '',
            userContext: userContext || {}
          })
        });

        const data = await resp.json();

        if (data.success) {
          sendResponse({ metrics: data.metrics });
        } else {
          sendResponse({ error: data.error || 'Unknown error from local LLM' });
        }
      } catch (error) {
        sendResponse({ error: `Failed to connect to local LLM server: ${error?.message || 'Unknown error'}. Make sure mlx_server.py is running on port 5000.` });
      }
    });

    return true;
  }
});
