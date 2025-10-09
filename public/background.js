chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === 'calculateViralityScore') {
    const { tweetText } = request;

    chrome.storage.sync.get(['userContext', 'cachedTwitterData', 'useLocalLLM'], async (result) => {
      const userContext = result.userContext || result.cachedTwitterData;

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

        if (!resp.ok) {
          const errText = await resp.text().catch(() => 'Local LLM error');
          sendResponse({ success: false, error: `Local LLM HTTP ${resp.status}: ${errText}` });
          return;
        }

        const data = await resp.json();

        if (data.success) {
          sendResponse({ success: true, metrics: data.metrics });
        } else {
          sendResponse({ success: false, error: data.error || 'Unknown error from local LLM' });
        }
      } catch (error) {
        sendResponse({ success: false, error: `Failed to connect to local LLM server: ${error?.message || 'Unknown error'}. Make sure mlx_server.py is running on port 5000.` });
      }
    });

    return true;
  }
});
