import Button from './components/Button';
import { useNavigate } from 'react-router-dom';

const StartCTASection = () => {
  const navigate = useNavigate();
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center max-lg:px-6 bg-white">
      <div className="absolute left-[-20px] top-5 max-xl:hidden">
        <img src="/images/landing/CTARabbit.svg" alt="CTA토끼" loading="lazy" />
      </div>

      <div className="text-center z-10">
        <h1 className="custom-font text-[200px] text-purple04 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] tracking-wide max-xl:text-[150px] max-sm:text-[52px]">
          LET’S START
          <br />
          IT PLACE!
        </h1>

        <div className="mt-10 flex justify-center items-center gap-6 max-md:flex-col">
          <Button variant="outline" onClick={() => navigate('/login')}>
            로그인하기
          </Button>
          <Button variant="primary" onClick={() => navigate('/main')}>
            잇플레이스로 가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartCTASection;
