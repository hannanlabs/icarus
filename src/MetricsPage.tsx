export default function MetricsPage({ onGoBack }: { onGoBack: () => void }) {
  const metrics = {
    engagementLikelihood: 53,
    conversationPotential: 78,
    outOfNetworkReach: 32,
    contentQuality: 69,
    authorReputation: 83
  };

  const getProgressWidth = (percentage: number) => (percentage / 100) * 282;

  return (
    <div className="bg-[#d9d9d9] relative w-[360px] h-[500px]">
      <p className="absolute font-inter font-semibold leading-normal left-[175.5px] not-italic text-[20px] text-black text-center text-nowrap top-[26px] translate-x-[-50%] whitespace-pre">
        Metrics for Tweet Performance
      </p>

      <div className="absolute contents left-[27px] top-[69px]">
        <p className="absolute font-inter font-normal leading-normal left-[126.5px] not-italic text-[18px] text-black text-center text-nowrap top-[69px] translate-x-[-50%] whitespace-pre">
          Engagement Likelihood
        </p>
        <div className="absolute bg-white h-[33px] left-[35px] top-[103px] w-[282px]" />
        <div className="absolute bg-[#ca3333] h-[33px] left-[27px] top-[103px]" style={{width: `${getProgressWidth(metrics.engagementLikelihood)}px`}} />
        <p className="absolute font-inter text-[12px] text-black left-[320px] top-[110px]">{metrics.engagementLikelihood}%</p>
      </div>

      <div className="absolute contents left-[27px] top-[155px]">
        <p className="absolute font-inter font-normal leading-normal left-[123.5px] not-italic text-[18px] text-black text-center text-nowrap top-[155px] translate-x-[-50%] whitespace-pre">
          Conversation Potential
        </p>
        <div className="absolute bg-white h-[33px] left-[27px] top-[188px] w-[282px]" />
        <div className="absolute bg-[#ca3333] h-[33px] left-[27px] top-[188px]" style={{width: `${getProgressWidth(metrics.conversationPotential)}px`}} />
        <p className="absolute font-inter text-[12px] text-black left-[320px] top-[195px]">{metrics.conversationPotential}%</p>
      </div>

      <div className="absolute contents left-[27px] top-[240px]">
        <p className="absolute font-inter font-normal leading-normal left-[121px] not-italic text-[18px] text-black text-center text-nowrap top-[240px] translate-x-[-50%] whitespace-pre">
          Out of Network Reach
        </p>
        <div className="absolute bg-white h-[33px] left-[27px] top-[272px] w-[282px]" />
        <div className="absolute bg-[#ca3333] h-[33px] left-[27px] top-[272px]" style={{width: `${getProgressWidth(metrics.outOfNetworkReach)}px`}} />
        <p className="absolute font-inter text-[12px] text-black left-[320px] top-[279px]">{metrics.outOfNetworkReach}%</p>
      </div>

      <div className="absolute contents left-[27px] top-[324px]">
        <p className="absolute font-inter font-normal leading-normal left-[132px] not-italic text-[18px] text-black text-center text-nowrap top-[324px] translate-x-[-50%] whitespace-pre">
          Content Quality & Safety
        </p>
        <div className="absolute bg-white h-[33px] left-[27px] top-[358px] w-[282px]" />
        <div className="absolute bg-[#ca3333] h-[33px] left-[27px] top-[358px]" style={{width: `${getProgressWidth(metrics.contentQuality)}px`}} />
        <p className="absolute font-inter text-[12px] text-black left-[320px] top-[365px]">{metrics.contentQuality}%</p>
      </div>

      <div className="absolute contents left-[27px] top-[410px]">
        <p className="absolute font-inter font-normal leading-normal left-[131.5px] not-italic text-[18px] text-black text-center text-nowrap top-[410px] translate-x-[-50%] whitespace-pre">
          Author Reputation Boost
        </p>
        <div className="absolute bg-white h-[33px] left-[27px] top-[442px] w-[282px]" />
        <div className="absolute bg-[#ca3333] h-[33px] left-[27px] top-[442px]" style={{width: `${getProgressWidth(metrics.authorReputation)}px`}} />
        <p className="absolute font-inter text-[12px] text-black left-[320px] top-[449px]">{metrics.authorReputation}%</p>
      </div>

      <div
        className="absolute left-[8px] top-[20px] cursor-pointer text-black text-[24px] hover:text-gray-600"
        onClick={onGoBack}
      >
        ←
      </div>
    </div>
  );
}