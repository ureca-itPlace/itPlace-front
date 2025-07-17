import React from 'react';
import { useNavigate } from 'react-router-dom';

// props 타입 정의
// message1: 상단 제목
// message2: 하단 설명
// buttonText: 버튼 문구 (없으면 버튼 안보임)
// buttonRoute: 버튼 클릭 시 이동할 경로 (없으면 버튼 안보임)
// isLoginRequired: 로그인 토끼 이미지 분기를 위한 로그인 여부

// Props 타입 지정
type NoResultProps = {
  message1?: string;
  message2?: string;
  buttonText?: string;
  buttonRoute?: string;
  isLoginRequired?: boolean; // 로그인용 이미지 분기 추가
  message1FontSize?: string; // 폰트 사이즈 커스터마이징
  message2FontSize?: string; // 폰트 사이즈 커스터마이징
};

const NoResult: React.FC<NoResultProps> = ({
  message1 = '앗! 일치하는 결과를 찾을 수 없어요!',
  message2 = '다른 키워드나 조건으로 다시 찾아보세요.',
  buttonText,
  buttonRoute,
  isLoginRequired = false,
  message1FontSize = 'text-title-4',
  message2FontSize = 'text-body-1',
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (buttonRoute) navigate(buttonRoute);
  };

  // 이미지 경로를 로그인 여부에 따라 분기
  const imageWebp = isLoginRequired
    ? '/images/bunny-login-require.webp'
    : '/images/bunny-no-result.webp';
  const imagePng = isLoginRequired
    ? '/images/bunny-login-require.png'
    : '/images/bunny-no-result.png';

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <picture>
        <source srcSet={imageWebp} type="image/webp" />
        <img src={imagePng} alt="no-result" className="w-36 h-auto mb-4" />
      </picture>

      <h2 className={`${message1FontSize} text-title-4 text-grey05 mb-2`}>{message1}</h2>
      <p className={`${message2FontSize} text-body-1 text-grey04 mb-4`}>{message2}</p>

      {buttonText && buttonRoute && (
        <button
          onClick={handleClick}
          className="px-9 py-2 rounded-full bg-purple04 text-white text-body-3  hover:bg-purple05"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default NoResult;
