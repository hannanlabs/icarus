chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchTwitterUser') {
    const { username, bearerToken } = request;

    fetch(`https://api.x.com/2/users/by/username/${username}?user.fields=public_metrics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        sendResponse({ success: true, data: data.data });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }

  if (request.action === 'calculateViralityScore') {
    const { tweetText } = request;

    chrome.storage.sync.get(['cachedTwitterData', 'useLocalLLM'], async (result) => {
      const userContext = result.cachedTwitterData;
      const useLocalLLM = result.useLocalLLM !== false;

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
