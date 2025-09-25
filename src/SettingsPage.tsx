export default function SettingsPage() {
  return (
    <div className="bg-[#d9d9d9] relative w-[360px] h-[500px]">
      <div className="absolute contents left-[30px] top-[19px]">
        <div className="absolute bg-white h-[21px] left-[283px] top-[51px] w-[34px]" />
        <p className="absolute font-inter font-normal leading-normal left-[30px] not-italic text-[12px] text-black text-nowrap top-[19px] whitespace-pre">
          Enter LLM API Key :
        </p>
        <div className="absolute bg-[#fdfdfd] h-[25px] left-[30px] top-[49px] w-[245px]" />
        <p className="absolute font-inter font-normal leading-normal left-[286px] not-italic text-[12px] text-black text-nowrap top-[54px] whitespace-pre">
          Save
        </p>
      </div>

      <div className="absolute contents left-[30px] top-[92px]">
        <div className="absolute bg-white h-[21px] left-[283px] top-[124px] w-[34px]" />
        <p className="absolute font-inter font-normal leading-normal left-[30px] not-italic text-[12px] text-black text-nowrap top-[92px] whitespace-pre">
          Enter Twitter Username :
        </p>
        <div className="absolute bg-[#fdfdfd] h-[25px] left-[30px] top-[122px] w-[245px]" />
        <p className="absolute font-inter font-normal leading-normal left-[286px] not-italic text-[12px] text-black text-nowrap top-[127px] whitespace-pre">
          Save
        </p>
      </div>

      <div className="absolute contents left-[30px] top-[165px]">
        <div className="absolute bg-[#ca3333] h-[25px] left-[30px] rounded-[18px] top-[193px] w-[245px]" />
        <div className="absolute contents left-[30px] top-[165px]">
          <p className="absolute font-inter font-normal leading-normal left-[30px] not-italic text-[12px] text-black text-nowrap top-[165px] whitespace-pre">
            Parse through Twitter Profile :
          </p>
        </div>
        <p className="absolute font-inter font-normal leading-normal left-[130px] not-italic text-[12px] text-nowrap text-white top-[198px] whitespace-pre">
          Execute
        </p>
      </div>

      <div className="absolute contents left-[30px] top-[240px]">
        <p className="absolute font-inter font-normal leading-normal left-[30px] not-italic text-[12px] text-black text-nowrap top-[240px] whitespace-pre">
          Parsed Data Viewer (Data parsed, not stored) :
        </p>
        <div className="absolute bg-white h-[202px] left-[30px] top-[275px] w-[293px]" />
      </div>
    </div>
  );
}