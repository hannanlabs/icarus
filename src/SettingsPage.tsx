export default function SettingsPage({ onGoBack }: { onGoBack: () => void }) {
  return (
    <div className="bg-[#d9d9d9] relative w-[360px] h-[500px]">
      <div className="absolute contents left-[30px] top-[29px]">
        <div className="absolute bg-white h-[21px] left-[283px] top-[61px] w-[34px]" />
        <p className="absolute font-inter font-normal leading-normal left-[30px] not-italic text-[15px] text-black text-nowrap top-[29px] whitespace-pre">
          Enter LLM API Key :
        </p>
        <div className="absolute bg-[#fdfdfd] h-[25px] left-[30px] top-[59px] w-[245px]" />
        <p className="absolute font-inter font-normal leading-normal left-[286px] not-italic text-[15px] text-black text-nowrap top-[64px] whitespace-pre">
          Save
        </p>
      </div>

      <div className="absolute contents left-[30px] top-[102px]">
        <div className="absolute bg-white h-[21px] left-[283px] top-[134px] w-[34px]" />
        <p className="absolute font-inter font-normal leading-normal left-[30px] not-italic text-[15px] text-black text-nowrap top-[102px] whitespace-pre">
          Enter Twitter Username :
        </p>
        <div className="absolute bg-[#fdfdfd] h-[25px] left-[30px] top-[132px] w-[245px]" />
        <p className="absolute font-inter font-normal leading-normal left-[286px] not-italic text-[15px] text-black text-nowrap top-[137px] whitespace-pre">
          Save
        </p>
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