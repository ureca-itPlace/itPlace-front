import kakaoLoginImg from '../../../../assets/loginPage/kakao_login.png';

type Props = {
  onClick: () => void;
};

const KakaoLoginButton = ({ onClick }: Props) => {
  return (
    <div className="w-[320px] max-xl:w-[274px] max-lg:w-[205px] h-[53px] max-xl:h-[45px] max-lg:h-[36px] bg-[#FEE500] rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] flex items-center justify-center">
      <button onClick={onClick}>
        <img src={kakaoLoginImg} alt="카카오 로그인" className="w-full h-full object-cover" />
      </button>
    </div>
  );
};

export default KakaoLoginButton;
