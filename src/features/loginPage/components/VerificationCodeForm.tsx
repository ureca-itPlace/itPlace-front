import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import AuthInput from './AuthInput';
import AuthFooter from './AuthFooter';
import AuthButton from './AuthButton';
import { TbClock } from 'react-icons/tb';
import { checkVerificationCode } from '../apis/verification';
import Modal from '../../../components/Modal';
import { modalPresets } from '../constants/modalPresets';

export interface ModalButton {
  label: string;
  onClick: () => void;
  type: 'primary' | 'secondary';
}

export interface ModalState {
  open: boolean;
  title: string;
  message: string;
  subMessage?: string;
  subMessageClass?: string;
  buttons: ModalButton[];
  children?: React.ReactNode;
}

type Props = {
  onGoToLogin: () => void;
  onVerified: () => void;
};

const VerificationCodeForm = ({ onGoToLogin, onVerified }: Props) => {
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const [modal, setModal] = useState<ModalState>({
    open: false,
    title: '',
    message: '',
    subMessage: '',
    subMessageClass: '',
    buttons: [],
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  // TODO: 실사용 시 props로 전달받기
  const name = '홍길동';
  const phone = '01000000000';

  useEffect(() => {
    gsap.fromTo(
      wrapperRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  const closeModal = () => {
    setModal({
      open: false,
      title: '',
      message: '',
      subMessage: '',
      subMessageClass: '',
      buttons: [],
    });
  };

  const handleResend = () => {
    console.log('인증번호 재발송 클릭됨');
    // TODO: 인증번호 재발송 API 호출 위치
  };

  const handleCheckCode = async () => {
    try {
      const res = await checkVerificationCode({ name, phoneNumber: phone, code });
      const { userStatus, isLocalUser, uplusDataExists } = res.data;

      setIsVerified(true);
      setCodeError('');

      // 아래는 실제 회원 존재 여부 확인 후 분기
      if (userStatus === 'EXISTING_USER' && isLocalUser) {
        setModal(
          modalPresets.alreadyJoined(() => {
            closeModal();
            onGoToLogin();
          }, closeModal)
        );
      } else if (userStatus === 'EXISTING_USER') {
        setModal(
          modalPresets.mergeAccount(
            () => {
              closeModal();
              setModal(
                modalPresets.integrationSuccess(() => {
                  closeModal();
                  onGoToLogin();
                })
              );
            },
            () => {
              closeModal();
              onGoToLogin();
            }
          )
        );
      } else if (uplusDataExists) {
        setModal(
          modalPresets.uplusMember(
            () => {
              closeModal();
              onVerified();
            },
            () => {
              closeModal();
              onGoToLogin();
            }
          )
        );
      }
    } catch (error: any) {
      const errorCode = error?.response?.data?.code;
      if (errorCode === 'SMS_CODE_MISMATCH') {
        setCodeError('인증번호가 일치하지 않습니다.');
      } else if (errorCode === 'SMS_CODE_EXPIRED') {
        setCodeError('인증번호가 만료되었습니다. 다시 요청해주세요.');
      } else {
        setCodeError('알 수 없는 오류가 발생했습니다.');
      }
      setIsVerified(false);
    }
  };

  return (
    <>
      <div ref={wrapperRef} className="w-full flex flex-col items-center">
        {/* 제목 */}
        <div className="text-left w-[320px]">
          <p className="text-title-4">
            보내드린 <span className="font-semibold">인증번호 6자리</span>를
          </p>
          <p className="text-title-4">입력해주세요</p>
        </div>

        {/* 인증번호 입력 + 확인 버튼 */}
        <div className="w-[320px] mt-[48px]">
          <div className="flex items-center relative">
            <AuthInput
              name="code"
              placeholder="인증번호"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setCodeError('');
              }}
              className="pr-[110px]"
            />
            <button
              type="button"
              onClick={handleCheckCode}
              className="absolute right-[12px] w-[69px] h-[26px] bg-purple04 text-white text-body-4 rounded-[10px]"
            >
              확인
            </button>
          </div>
          {codeError && <p className="w-[320px] text-danger text-body-3 mt-[6px]">{codeError}</p>}
        </div>

        {/* 타이머 + 안내 텍스트 */}
        <div className="text-body-3 text-grey03 mt-[20px] w-[320px] flex items-center gap-[4px]">
          <TbClock size={16} className="text-grey03" />
          <span>남은 시간</span>
          <span className="text-danger font-medium">2:58</span>
        </div>

        <div className="text-body-3 text-grey03 mt-[13px] w-[320px]">
          인증 번호를 받지 못하셨나요?{' '}
          <span onClick={handleResend} className="text-purple04 font-medium cursor-pointer">
            다시 보내기
          </span>
        </div>

        {/* 다음 버튼 */}
        <AuthButton
          label="다음"
          onClick={onVerified}
          variant={isVerified ? 'default' : 'disabled'}
          className="mt-[180px]"
        />

        {/* 하단 링크 */}
        <AuthFooter
          leftText="이미 회원이신가요?"
          rightText="로그인 하러 가기"
          onRightClick={onGoToLogin}
        />
      </div>

      {/* 공통 모달 */}
      <Modal
        isOpen={modal.open}
        title={modal.title}
        message={modal.message}
        subMessage={modal.subMessage}
        subMessageClass={modal.subMessageClass}
        buttons={modal.buttons}
        onClose={closeModal}
        children={modal.children}
      />
    </>
  );
};

export default VerificationCodeForm;
