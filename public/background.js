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

    chrome.storage.sync.get(['llmApiKey', 'cachedTwitterData'], async (result) => {
      const apiKey = result.llmApiKey;
      const userContext = result.cachedTwitterData;

      if (!apiKey) {
        sendResponse({ success: false, error: 'Missing OpenAI API key' });
        return;
      }

      try {
        const system = `You score a tweet's potential performance on Twitter using five metrics.
Return only compact JSON with integer percentages (0-100) for:
- engagementLikelihood
- conversationPotential
- outOfNetworkReach
- contentQuality
- authorReputation
Include overallScore as an integer 0-100 summarizing the tweet.
Do not include explanations.`;

        const userContent = [
          'Score the following tweet using the five metrics and overallScore. Return JSON only.\n',
          'Tweet:\n',
          (tweetText || ''),
          '\n\nAuthor context (JSON):\n',
          JSON.stringify(userContext || {}, null, 2)
        ].join('');

        const body = {
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          temperature: 0.2,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: userContent }
          ]
        };

        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(body)
        });

        if (!resp.ok) {
          const errText = await resp.text().catch(() => 'OpenAI error');
          sendResponse({ success: false, error: `OpenAI HTTP ${resp.status}: ${errText}` });
          return;
        }

        const data = await resp.json();
        const content = data?.choices?.[0]?.message?.content || '';

        let parsed;
        try {
          parsed = JSON.parse(content);
        } catch (e) {
          const match = content.match(/\{[\s\S]*\}/);
          if (match) {
            parsed = JSON.parse(match[0]);
          }
        }

        if (!parsed) {
          sendResponse({ success: false, error: 'Failed to parse OpenAI response as JSON' });
          return;
        }

        const clamp = (n) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
        const metrics = {
          engagementLikelihood: clamp(parsed.engagementLikelihood),
          conversationPotential: clamp(parsed.conversationPotential),
          outOfNetworkReach: clamp(parsed.outOfNetworkReach),
          contentQuality: clamp(parsed.contentQuality),
          authorReputation: clamp(parsed.authorReputation),
          overallScore: clamp(parsed.overallScore)
        };

        sendResponse({ success: true, metrics });
      } catch (error) {
        sendResponse({ success: false, error: error?.message || 'Unexpected error' });
      }
    });

    return true;
  }
});
