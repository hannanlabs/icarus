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
});
