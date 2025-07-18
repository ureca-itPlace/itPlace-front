import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import AuthInput from '../common/AuthInput';
import AuthFooter from '../common/AuthFooter';
import AuthButton from '../common/AuthButton';
import { TbClock } from 'react-icons/tb';
import { checkVerificationCode, sendVerificationCode } from '../../apis/verification';
import Modal from '../../../../components/Modal';
import { modalPresets } from '../../constants/modalPresets';
import { showToast } from '../../../../utils/toast';
import { loadUplusData } from '../../apis/auth';

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
  onVerified: (userInfo: {
    name: string;
    phone: string;
    birthday: string;
    gender: string;
    membershipId: string;
    isUplus: boolean;
    verifiedType: 'new' | 'uplus' | 'local' | 'oauth';
  }) => void;
  name: string;
  phone: string;
};

const VerificationCodeForm = ({ onGoToLogin, onVerified, name, phone }: Props) => {
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // 인증 성공 후 사용자 상태 저장
  const verifiedTypeRef = useRef<'local' | 'oauth' | 'uplus' | 'new' | null>(null);
  const userInfoRef = useRef<{
    name: string;
    phone: string;
    birthday: string;
    gender: string;
    membershipId: string;
  } | null>(null);

  // 타이머 상태 및 제어
  const [timeLeft, setTimeLeft] = useState(180);
  const timerRef = useRef<number | null>(null);

  // 모달 상태
  const [modal, setModal] = useState<ModalState>({
    open: false,
    title: '',
    message: '',
    subMessage: '',
    subMessageClass: '',
    buttons: [],
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  // 페이드인 애니메이션
  useEffect(() => {
    gsap.fromTo(
      wrapperRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  // 타이머 시작 및 정리
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(180);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          showToast('인증 시간이 만료되었습니다.', 'error', {
            position: 'top-center',
          });
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

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
      await sendVerificationCode(name, phone);
      setCode('');
      startTimer();
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
        phoneNumber: phone,
        verificationCode: code,
      });

      setCodeError('');
      showToast('인증에 성공하였습니다.', 'success');
      console.log('[checkVerificationCode 응답]', res.data);

      const { userStatus, isLocalUser, uplusDataExists } = res.data.data;
      console.log('[🧪 uplusDataExists]', uplusDataExists, typeof uplusDataExists);

      // 분기 처리
      if (userStatus === 'EXISTING_USER' && isLocalUser === true) {
        verifiedTypeRef.current = 'local';
      } else if (userStatus === 'EXISTING_USER') {
        verifiedTypeRef.current = 'oauth';
      } else if (
        userStatus === 'NEW_USER' &&
        (uplusDataExists === true || uplusDataExists === 'true')
      ) {
        verifiedTypeRef.current = 'uplus';
      } else {
        verifiedTypeRef.current = 'new';
      }

      console.log('[분기 결과] verifiedType:', verifiedTypeRef.current);
      // 사용자 정보 저장 (공통 구조로)
      userInfoRef.current = {
        name,
        phone,
        birthday: '',
        gender: '',
        membershipId: '',
      };

      setIsVerified(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorCode = error.response?.data?.code;

        if (errorCode === 'SMS_CODE_MISMATCH') {
          setCodeError('인증번호가 일치하지 않습니다.');
        } else if (errorCode === 'SMS_CODE_EXPIRED') {
          setCodeError('인증번호가 만료되었습니다. 다시 요청해주세요.');
        } else {
          setCodeError('인증번호가 일치하지 않습니다.');
        }

        console.error('[checkVerificationCode 실패]', error.response?.data);
      } else {
        setCodeError('알 수 없는 오류가 발생했습니다.');
        console.error('[checkVerificationCode 실패 - Unknown]', error);
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
          <span className="text-danger font-medium">{formatTime(timeLeft)}</span>
        </div>

        {/* 재전송 */}
        <div className="text-body-3 text-grey03 mt-[13px] w-[320px]">
          인증 번호를 받지 못하셨나요?{' '}
          <button
            onClick={handleResend}
            disabled={timeLeft > 0}
            className={`font-medium ml-[4px] ${
              timeLeft > 0 ? 'text-grey03 cursor-not-allowed' : 'text-purple04 cursor-pointer'
            }`}
          >
            다시 보내기
          </button>
        </div>

        {/* 다음 버튼 */}
        <AuthButton
          label="다음"
          onClick={() => {
            const user = userInfoRef.current!;
            const commonUserInfo = {
              name: user.name,
              phone: user.phone,
              birthday: user.birthday,
              gender: user.gender,
              membershipId: user.membershipId,
              isUplus: verifiedTypeRef.current === 'uplus',
              verifiedType: verifiedTypeRef.current!,
            };

            switch (verifiedTypeRef.current) {
              case 'local':
                setModal(
                  modalPresets.alreadyJoined(() => {
                    closeModal();
                    onGoToLogin();
                  }, closeModal)
                );
                break;

              case 'oauth':
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
                break;

              case 'uplus':
                setModal(
                  modalPresets.uplusMember(
                    async () => {
                      closeModal();
                      try {
                        const res = await loadUplusData(phone);
                        const { name, phoneNumber, gender, birthday, membershipId } = res.data.data;

                        onVerified({
                          name,
                          phone: phoneNumber,
                          birthday: birthday ?? '',
                          gender: gender ?? '',
                          membershipId: membershipId ?? '',
                          isUplus: true,
                          verifiedType: 'uplus',
                        });
                      } catch {
                        showToast('U+ 정보 불러오기에 실패했습니다.', 'error');
                        onVerified(commonUserInfo); // fallback
                      }
                    },
                    () => {
                      closeModal();
                      onVerified(commonUserInfo); // 사용자가 "아니요" 선택 시
                    }
                  )
                );
                break;

              case 'new':
                onVerified(commonUserInfo);
                break;

              default:
                break;
            }
          }}
          variant={isVerified ? 'default' : 'disabled'}
          className="mt-[180px]"
        />

        {/* 로그인 링크 */}
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
