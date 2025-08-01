import { useNavigate } from 'react-router-dom';
import { useResponsive } from '../hooks/useResponsive';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  return (
    <div className="w-full h-screen flex flex-col items-center overflow-hidden">
      {isMobile ? (
        <img
          src="/images/notfound/notfound-bg-mobile.webp"
          alt="결과없음배경"
          loading="lazy"
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />
      ) : (
        <img
          src="/images/notfound/notfound-bg.webp"
          alt="결과없음배경"
          loading="lazy"
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />
      )}

      {/* 콘텐츠 */}
      <div className="text-center text-white pt-32 max-md:pt-28">
        <h1 className="text-9xl font-bold mb-2 max-sm:text-6xl">404</h1>
        <h4 className="text-4xl mb-10 max-sm:text-2xl max-sm:mb-6">Not Found Page</h4>
        <button
          onClick={() => navigate('/main')}
          className="bg-white text-purple03 px-16 pt-3 pb-2 text-xl rounded-full max-sm:text-base max-sm:px-10 hover:bg-purple02 hover:text-white"
        >
          메인페이지로 가기
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
