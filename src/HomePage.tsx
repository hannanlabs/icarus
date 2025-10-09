import { useEffect, useState } from 'react';
import { backend, type metrics } from './backend/storageSetting';

interface HomePageProps {
  onSetupClick: () => void;
}

export default function HomePage({ onSetupClick }: HomePageProps) {
  const [tweetText, setTweetText] = useState('');
  const [userContext, setUserContext] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [metrics, setMetrics] = useState<metrics | null>(null);

  useEffect(() => {
    const load = async () => {
      const [context, lastText, lastMetrics] = await Promise.all([
        backend.getSettings(),
        backend.getTweet(),
        backend.getMetrics(),
      ]);
      setUserContext(context);
      if (lastText) setTweetText(lastText);
      if (lastMetrics) {
        setMetrics(lastMetrics);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const hasUserContext = !!userContext;
  const hasTweet = tweetText.trim().length > 0;
  const canCalculate = hasTweet && hasUserContext;

  const handleCalculate = async () => {
    if (!canCalculate) return;
    setIsCalculating(true);
    const result = await backend.engagement(tweetText.trim());
    if (result) {
      setMetrics(result);
    }
    setIsCalculating(false);
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
      <div className="absolute left-[30px] top-[60px] w-[300px]">
        <p className="font-inter text-[14px] text-black mb-1">Enter Tweet</p>
        <textarea
          value={tweetText}
          onChange={async (e) => {
            const v = e.target.value;
            setTweetText(v);
            await backend.saveTweet(v);
          }}
          placeholder="Paste your tweet here..."
          className="w-full h-[90px] bg-white border border-gray-300 rounded p-2 text-[12px] resize-none"
        />
        {!canCalculate && (
          <div className="text-[11px] text-gray-700 mt-1">
            {!hasTweet && <div>• Enter tweet text</div>}
            {!hasUserContext && <div>• Add profile summary in Setup</div>}
          </div>
        )}
      </div>

      {metrics && (
        <div className="absolute left-[30px] top-[200px] w-[300px]">
          <div className="bg-white/50 rounded-lg p-4 space-y-3">
            <p className="font-inter font-semibold text-[16px] text-black mb-3 text-center">Estimated Performance</p>

            <div className="flex justify-between items-center">
              <span className="font-inter text-[12px] text-gray-700">Likes:</span>
              <span className="font-inter font-bold text-[14px] text-black">{metrics.likes?.toLocaleString() ?? '--'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-inter text-[12px] text-gray-700">Views:</span>
              <span className="font-inter font-bold text-[14px] text-black">{metrics.views?.toLocaleString() ?? '--'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-inter text-[12px] text-gray-700">Replies:</span>
              <span className="font-inter font-bold text-[14px] text-black">{metrics.replies?.toLocaleString() ?? '--'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-inter text-[12px] text-gray-700">Reposts:</span>
              <span className="font-inter font-bold text-[14px] text-black">{metrics.reposts?.toLocaleString() ?? '--'}</span>
            </div>
          </div>
        </div>
      )}

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
          disabled={isCalculating}
        >
          {isCalculating ? '...' : 'Calculate'}
        </button>
      )}
    </div>
  );
}
