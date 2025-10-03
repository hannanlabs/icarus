import { useEffect, useMemo, useState } from 'react';
import { backend, type UserSettings } from './backend';

interface HomePageProps {
  onCircleClick: () => void;
  onSetupClick: () => void;
}

export default function HomePage({ onCircleClick, onSetupClick }: HomePageProps) {
  const [tweetText, setTweetText] = useState('');
  const [settings, setSettings] = useState<UserSettings>({ llmApiKey: '', twitterUsername: '', twitterBearerToken: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const s = await backend.getSettings();
      setSettings(s);
      setIsLoading(false);
    };
    load();
  }, []);

  const usernameLabel = useMemo(() => {
    const u = settings.twitterUsername?.trim();
    return u ? `@${u}` : '';
  }, [settings.twitterUsername]);

  const hasApiKey = !!settings.llmApiKey;
  const hasParsedTwitter = !!settings.cachedTwitterData;
  const hasTweet = tweetText.trim().length > 0;
  const canCalculate = hasTweet && hasApiKey && hasParsedTwitter;

  const handleCalculate = () => {
    const text = tweetText.trim();
    let s = 40; 
    const len = text.length;
    if (len >= 40 && len <= 180) s += 15; else if (len < 20) s -= 5; else if (len > 240) s -= 10;
    const hashtags = (text.match(/#/g) || []).length;
    const mentions = (text.match(/@/g) || []).length;
    const questions = (text.match(/\?/g) || []).length;
    const emojis = (text.match(/\p{Emoji_Presentation}/gu) || []).length;
    s += Math.min(hashtags * 4, 12);
    s += Math.min(questions * 6, 12);
    s += Math.min(emojis * 3, 9);
    s -= Math.min(Math.max(mentions - 2, 0) * 2, 8);
    s = Math.max(0, Math.min(100, Math.round(s)));
    setScore(s);
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
      <p className="absolute font-inknut-antiqua leading-normal left-[35px] not-italic text-[24px] text-black text-nowrap top-[20px] whitespace-pre">
        Welcome {usernameLabel}
      </p>

      <div className="absolute left-[30px] top-[60px] w-[300px]">
        <p className="font-inter text-[14px] text-black mb-1">Enter Tweet</p>
        <textarea
          value={tweetText}
          onChange={(e) => setTweetText(e.target.value)}
          placeholder="Paste your tweet here..."
          className="w-full h-[90px] bg-white border border-gray-300 rounded p-2 text-[12px] resize-none"
        />
        {!canCalculate && (
          <div className="text-[11px] text-gray-700 mt-1">
            {!hasTweet && <div>• Enter tweet text</div>}
            {!hasApiKey && <div>• Add OpenAI API key in Setup</div>}
            {!hasParsedTwitter && <div>• Execute Twitter info in Setup</div>}
          </div>
        )}
      </div>

=      <div className="absolute left-0 top-[220px] w-full flex items-center justify-center">
        <div className="cursor-pointer" onClick={onCircleClick}>
          <p className="font-inter font-extrabold text-[36px] text-black">
            {score !== null ? `${score}/100` : '--/100'}
          </p>
        </div>
      </div>

      <div
        className="absolute left-[235px] top-[445px] w-[110px] h-[55px] bg-gradient-to-br from-gray-800 to-black rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl"
        onClick={onSetupClick}
      >
        <p className="font-inter font-bold text-[24px] text-white">Setup</p>
      </div>

      {canCalculate && (
        <button
          className="absolute left-[15px] top-[445px] w-[110px] h-[55px] bg-gradient-to-br from-[#ca3333] to-[#a62a2a] rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl text-white font-inter font-bold text-[20px]"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
    </div>
  );
}
