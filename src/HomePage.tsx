import circleIcon from './assets/circle.svg';

interface HomePageProps {
  onCircleClick: () => void;
  onSetupClick: () => void;
}

export default function HomePage({ onCircleClick, onSetupClick }: HomePageProps) {
  return (
    <div className="bg-[#d9d9d9] relative w-[360px] h-[500px]">
      <p className="absolute font-inknut-antiqua leading-normal left-[35px] not-italic text-[30px] text-black text-nowrap top-[48px] whitespace-pre">
        Welcome @hannanlabs
      </p>
      <p className="absolute font-inknut-antiqua leading-normal left-[65px] not-italic text-[30px] text-black text-nowrap top-[132px] whitespace-pre">
        Tweet Viral Score
      </p>
      <div
        className="absolute h-[208px] left-[65px] top-[210px] w-[209px] cursor-pointer"
        onClick={onCircleClick}
      >
        <img alt="" className="block max-w-none size-full" src={circleIcon} />
      </div>
      <p className="absolute font-inter font-extrabold leading-normal left-[123px] not-italic text-[30px] text-black text-nowrap top-[300px] whitespace-pre">
        79/100
      </p>
      <div className="absolute left-[235px] top-[445px] w-[110px] h-[55px] bg-gradient-to-br from-gray-800 to-black rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl" onClick={onSetupClick}>
        <p className="font-inter font-bold text-[24px] text-white">
          Setup
        </p>
      </div>
      <div className="absolute left-[15px] top-[445px] w-[110px] h-[55px] bg-gradient-to-br from-gray-800 to-black rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl">
        <p className="font-inter font-bold text-[24px] text-white">
          Calculate
        </p>
      </div>
    </div>
  );
}