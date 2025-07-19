import bgImage from '/images/landing/bg-earth.webp';

const EarthSection = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center flex items-center justify-center text-9xl text-white"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      지구없는 지구 섹션입니다.
    </div>
  );
};

export default EarthSection;
