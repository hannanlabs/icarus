import { useState, useEffect } from 'react';
import { backend } from './backend/storageSetting';

export default function SettingsPage({ onGoBack }: { onGoBack: () => void }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userContext, setUserContext] = useState('');
  const [contextSaved, setContextSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const context = await backend.getSettings();
      setUserContext(context);
      setIsLoading(false);
    };

    loadSettings();
  }, []);

  const handleSaveUserContext = async () => {
    const success = await backend.saveSettings(userContext);
    if (success) {
      setContextSaved(true);
      setTimeout(() => setContextSaved(false), 2000);
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
        <p className="absolute font-inter font-normal leading-normal left-[30px] not-italic text-[16px] text-black text-nowrap top-[29px] whitespace-pre">
          Profile Summary from Groq :
        </p>
        <textarea
          value={userContext}
          onChange={(e) => setUserContext(e.target.value)}
          className="absolute bg-[#fdfdfd] h-[350px] left-[30px] top-[65px] w-[293px] px-3 py-2 text-[12px] border border-gray-300 rounded resize-none"
          placeholder="Paste your profile summary from Groq here..."
        />
        <button
          onClick={handleSaveUserContext}
          className={`absolute h-[30px] left-[30px] top-[430px] w-[293px] border border-gray-300 rounded text-[14px] cursor-pointer ${
            contextSaved ? 'bg-green-200 text-green-800' : 'bg-[#ca3333] text-white hover:bg-[#b02a2a]'
          }`}
        >
          {contextSaved ? '✓ Saved' : 'Save'}
        </button>
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