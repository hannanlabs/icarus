import circleIcon from './assets/circle.svg';

export default function App() {
  return (
    <div className="bg-[#d9d9d9] relative w-[360px] h-[500px]">
      <p className="absolute font-inter font-normal leading-normal left-[53px] not-italic text-[23px] text-black text-nowrap top-[73px] whitespace-pre">
        Welcome @hannanlabs
      </p>
      <div className="absolute bg-[#ca3333] h-[64px] left-[21px] rounded-[39px] top-[147px] w-[318px]" />
      <p className="absolute font-sans leading-normal left-[43px] not-italic text-[18px] text-nowrap text-white top-[168px] whitespace-pre">
        Press to parse profile for input data
      </p>
      <p className="absolute font-inter font-normal leading-normal left-[97px] not-italic text-[18px] text-black text-nowrap top-[257px] whitespace-pre">
        Tweet Viral Score :
      </p>
      <div className="absolute h-[153px] left-[102px] top-[314px] w-[155px]">
        <img alt="" className="block max-w-none w-full h-full" src={circleIcon} />
      </div>
      <p className="absolute font-inter font-normal leading-normal left-[147px] not-italic text-[18px] text-nowrap text-white top-[380px] whitespace-pre">
        79/100
      </p>
    </div>
  );
}
