import circleIcon from './assets/circle.svg';

export default function App() {
  return (
    <div className="w-[386px] h-[583px] bg-[#d9d9d9] relative">
      <div className="flex flex-col items-center p-8">
        <p className="font-inter text-[23px] font-normal text-black mb-8 text-center mt-8">
          Welcome @hannanlabs
        </p>

        <div className="bg-[#ca3333] w-[318px] h-[64px] flex items-center justify-center mb-24">
          <p className="font-inter text-[18px] font-normal text-black text-center">
            Press to parse profile for input data
          </p>
        </div>

        <div className="flex flex-col items-center mt-8">
          <p className="font-inter text-[18px] font-normal text-black mb-8">
            Tweet Viral Score :
          </p>

          <div className="relative w-[155px] h-[155px] flex items-center justify-center">
            <img alt="" className="absolute w-full h-full" src={circleIcon} />
            <p className="relative z-10 font-inter text-[18px] font-normal text-white">
              79/100
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
