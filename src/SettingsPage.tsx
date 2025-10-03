import { useState, useEffect } from 'react';
import { backend, type TwitterUserData } from './backend';

export default function SettingsPage({ onGoBack }: { onGoBack: () => void }) {
  const [apiKey, setApiKey] = useState('');
  const [twitterUsername, setTwitterUsername] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [twitterSaved, setTwitterSaved] = useState(false);
  const [bearerTokenSaved, setBearerTokenSaved] = useState(false);
  const [twitterData, setTwitterData] = useState<TwitterUserData | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await backend.getSettings();
      setApiKey(settings.llmApiKey);
      setTwitterUsername(settings.twitterUsername);
      setBearerToken(settings.twitterBearerToken);
      if (settings.cachedTwitterData) {
        setTwitterData(settings.cachedTwitterData);
      }
      setIsLoading(false);
    };

    loadSettings();
  }, []);

  const handleSaveApiKey = async () => {
    const success = await backend.saveApiKey(apiKey);
    if (success) {
      setApiKeySaved(true);
      setTimeout(() => setApiKeySaved(false), 2000);
    }
  };

  const handleSaveTwitterUsername = async () => {
    const success = await backend.saveTwitterUsername(twitterUsername);
    if (success) {
      setTwitterSaved(true);
      setTimeout(() => setTwitterSaved(false), 2000);
    }
  };

  const handleSaveBearerToken = async () => {
    const success = await backend.saveBearerToken(bearerToken);
    if (success) {
      setBearerTokenSaved(true);
      setTimeout(() => setBearerTokenSaved(false), 2000);
    }
  };

  const handleExecute = async () => {
    setIsFetching(true);
    setFetchError('');
    setTwitterData(null);

    const data = await backend.fetchTwitterUserData(twitterUsername, bearerToken);

    if (data) {
      setTwitterData(data);
    } else {
      setFetchError('Failed to fetch data. Check username and bearer token.');
    }

    setIsFetching(false);
  };

  if (isLoading) {
    return (
      <div className="bg-[#d9d9d9] relative w-[360px] h-[500px] flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }
  return (
    <div className="bg-[#d9d9d9] relative w-[360px] h-[500px]">
      <div className="absolute contents left-[30px] top-[29px]">
        <p className="absolute font-inter font-normal leading-normal left-[30px] not-italic text-[15px] text-black text-nowrap top-[29px] whitespace-pre">
          Enter LLM API Key :
        </p>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="absolute bg-[#fdfdfd] h-[25px] left-[30px] top-[59px] w-[245px] px-2 text-[12px] border border-gray-300 rounded"
          placeholder="Enter your API key"
        />
        <button
          onClick={handleSaveApiKey}
          className={`absolute h-[21px] left-[283px] top-[61px] w-[34px] border border-gray-300 rounded text-[12px] cursor-pointer ${
            apiKeySaved ? 'bg-green-200 text-green-800' : 'bg-white hover:bg-gray-100'
          }`}
        >
          {apiKeySaved ? '✓' : 'Save'}
        </button>
      </div>

      <div className="absolute contents left-[30px] top-[102px]">
        <p className="absolute font-inter font-normal leading-normal left-[30px] not-italic text-[15px] text-black text-nowrap top-[102px] whitespace-pre">
          Enter Twitter Username :
        </p>
        <input
          type="text"
          value={twitterUsername}
          onChange={(e) => setTwitterUsername(e.target.value)}
          className="absolute bg-[#fdfdfd] h-[25px] left-[30px] top-[132px] w-[245px] px-2 text-[12px] border border-gray-300 rounded"
          placeholder="@username"
        />
        <button
          onClick={handleSaveTwitterUsername}
          className={`absolute h-[21px] left-[283px] top-[134px] w-[34px] border border-gray-300 rounded text-[12px] cursor-pointer ${
            twitterSaved ? 'bg-green-200 text-green-800' : 'bg-white hover:bg-gray-100'
          }`}
        >
          {twitterSaved ? '✓' : 'Save'}
        </button>
      </div>

      <div className="absolute contents left-[30px] top-[175px]">
        <p className="absolute font-inter font-normal leading-normal left-[30px] not-italic text-[15px] text-black text-nowrap top-[175px] whitespace-pre">
          Enter Twitter Bearer Token :
        </p>
        <input
          type="password"
          value={bearerToken}
          onChange={(e) => setBearerToken(e.target.value)}
          className="absolute bg-[#fdfdfd] h-[25px] left-[30px] top-[205px] w-[245px] px-2 text-[12px] border border-gray-300 rounded"
          placeholder="Bearer token"
        />
        <button
          onClick={handleSaveBearerToken}
          className={`absolute h-[21px] left-[283px] top-[207px] w-[34px] border border-gray-300 rounded text-[12px] cursor-pointer ${
            bearerTokenSaved ? 'bg-green-200 text-green-800' : 'bg-white hover:bg-gray-100'
          }`}
        >
          {bearerTokenSaved ? '✓' : 'Save'}
        </button>
      </div>

      <div className="absolute contents left-[30px] top-[248px]">
        <button
          onClick={handleExecute}
          disabled={isFetching || !twitterUsername || !bearerToken}
          className="absolute bg-[#ca3333] h-[25px] left-[30px] rounded-[18px] top-[276px] w-[245px] cursor-pointer hover:bg-[#b02a2a] disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <p className="font-inter font-normal leading-normal not-italic text-[15px] text-nowrap text-white whitespace-pre">
            {isFetching ? 'Loading...' : 'Execute'}
          </p>
        </button>
        <div className="absolute contents left-[30px] top-[248px]">
          <p className="absolute font-inter font-normal leading-normal left-[30px] not-italic text-[15px] text-black text-nowrap top-[248px] whitespace-pre">
            Parse through Twitter Profile :
          </p>
        </div>
      </div>

      <div className="absolute contents left-[30px] top-[323px]">
        <p className="absolute font-inter font-normal leading-normal left-[30px] not-italic text-[15px] text-black text-nowrap top-[323px] whitespace-pre">
          Parsed Data Viewer (Data parsed, not stored) :
        </p>
        <div className="absolute bg-white h-[130px] left-[30px] top-[358px] w-[293px] border border-gray-300 rounded overflow-auto p-2">
          {fetchError && (
            <div className="text-red-600 text-[12px]">{fetchError}</div>
          )}
          {twitterData && (
            <div className="text-[12px] font-mono">
              <div><strong>Name:</strong> {twitterData.name}</div>
              <div><strong>Username:</strong> @{twitterData.username}</div>
              <div><strong>ID:</strong> {twitterData.id}</div>
              <div className="mt-2"><strong>Public Metrics:</strong></div>
              <div className="ml-2">
                <div>Followers: {twitterData.public_metrics.followers_count.toLocaleString()}</div>
                <div>Following: {twitterData.public_metrics.following_count.toLocaleString()}</div>
                <div>Tweets: {twitterData.public_metrics.tweet_count.toLocaleString()}</div>
                <div>Listed: {twitterData.public_metrics.listed_count.toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="absolute left-[8px] top-[1px] cursor-pointer text-black text-[24px] hover:text-gray-600"
        onClick={onGoBack}
      >
        ←
      </div>
    </div>
  );
}