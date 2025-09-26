import { useState, useEffect } from 'react';
import { backend } from './backend';

export default function SettingsPage({ onGoBack }: { onGoBack: () => void }) {
  const [apiKey, setApiKey] = useState('');
  const [twitterUsername, setTwitterUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [twitterSaved, setTwitterSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await backend.getSettings();
      setApiKey(settings.llmApiKey);
      setTwitterUsername(settings.twitterUsername);
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
        <div className="absolute bg-[#ca3333] h-[25px] left-[30px] rounded-[18px] top-[203px] w-[245px]" />
        <div className="absolute contents left-[30px] top-[175px]">
          <p className="absolute font-inter font-normal leading-normal left-[30px] not-italic text-[15px] text-black text-nowrap top-[175px] whitespace-pre">
            Parse through Twitter Profile :
          </p>
        </div>
        <p className="absolute font-inter font-normal leading-normal left-[130px] not-italic text-[15px] text-nowrap text-white top-[208px] whitespace-pre">
          Execute
        </p>
      </div>

      <div className="absolute contents left-[30px] top-[250px]">
        <p className="absolute font-inter font-normal leading-normal left-[30px] not-italic text-[15px] text-black text-nowrap top-[250px] whitespace-pre">
          Parsed Data Viewer (Data parsed, not stored) :
        </p>
        <div className="absolute bg-white h-[202px] left-[30px] top-[285px] w-[293px]" />
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