import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import AuthInput from './AuthInput';
import AuthFooter from './AuthFooter';
import AuthButton from './AuthButton';
import { TbClock } from 'react-icons/tb';
import { checkVerificationCode, sendVerificationCode } from '../apis/verification';
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
  mode: 'signup' | 'find';
  onGoToLogin: () => void;
  onVerified: (userInfo?: { name: string; phone: string }) => void;
  name: string;
  phone: string;
  registrationId: string;
};

const VerificationCodeForm = ({
  mode,
  onGoToLogin,
  onVerified,
  name,
  phone,
  registrationId,
}: Props) => {
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

  const handleResend = async () => {
    try {
      console.log('재전송 요청', name, phone);
      await sendVerificationCode(name, phone); //상위에서 받은 휴대 번호
      setCode('');
    } catch (error) {
      console.log('재전송 실패', error);
    }
  };

  const handleCheckCode = async () => {
    if (!code.trim()) {
      setCodeError('인증번호를 입력해주세요.');
      return;
    }
    try {
      const res = await checkVerificationCode({
        registrationId,
        phoneNumber: phone,
        verificationCode: code,
      });
      console.log('인증 성공', res.data);
      setIsVerified(true);
      setCodeError('');

      const { userStatus, isLocalUser, uplusDataExists, uplusData } = res.data;

      // 로컬 계정 → 로그인 유도
      if (userStatus === 'EXISTING_USER' && isLocalUser) {
        setModal(
          modalPresets.alreadyJoined(() => {
            closeModal();
            onGoToLogin();
          }, closeModal)
        );
      }

      // OAuth 가입자 → 통합 안내
      else if (userStatus === 'EXISTING_USER') {
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
      }

      // U+ 기존 가입자 → 정보 사용 여부 물어보기
      else if (uplusDataExists && uplusData) {
        setModal(
          modalPresets.uplusMember(
            () => {
              closeModal();
              if (mode === 'signup') {
                onVerified({ name: uplusData.name, phone: uplusData.phone });
              } else {
                onVerified();
              }
            },
            () => {
              closeModal();
              if (mode === 'signup') {
                onVerified({ name, phone });
              } else {
                onVerified();
              }
            }
          )
        );
      }

      // 신규 사용자
      else {
        if (mode === 'signup') {
          onVerified({ name, phone });
        } else {
          onVerified();
        }
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

        {/* 인증번호 입력 */}
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

        {/* 타이머 */}
        <div className="text-body-3 text-grey03 mt-[20px] w-[320px] flex items-center gap-[4px]">
          <TbClock size={16} className="text-grey03" />
          <span>남은 시간</span>
          <span className="text-danger font-medium">2:58</span>
        </div>

        {/* 재전송 */}
        <div className="text-body-3 text-grey03 mt-[13px] w-[320px]">
          인증 번호를 받지 못하셨나요?{' '}
          <span onClick={handleResend} className="text-purple04 font-medium cursor-pointer">
            다시 보내기
          </span>
        </div>

        {/* 다음 버튼 */}
        <AuthButton
          label="다음"
          onClick={() => {
            if (mode === 'signup') {
              onVerified({ name, phone });
            } else {
              onVerified();
            }
          }}
          variant={isVerified ? 'default' : 'disabled'}
          className="mt-[180px]"
        />

        {/* 하단 로그인 링크 */}
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
      >
        {modal.children}
      </Modal>
    </>
  );
};

export default VerificationCodeForm;
