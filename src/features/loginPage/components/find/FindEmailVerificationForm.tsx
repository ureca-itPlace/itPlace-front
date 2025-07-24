import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import AuthInput from '../common/AuthInput';
import AuthButton from '../common/AuthButton';
import { TbClock } from 'react-icons/tb';
import { confirmFindEmail, sendFindEmailCode } from '../../apis/user';
import { showToast } from '../../../../utils/toast';
import LoadingSpinner from '../../../../components/LoadingSpinner'; // LoadingSpinner 가져오기

type Props = {
  name: string;
  phone: string;
  onSuccess: (email: string, createdAt: string) => void;
};

const FindEmailVerificationForm = ({ name, phone, onSuccess }: Props) => {
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // 타이머 상태 및 제어
  const [timeLeft, setTimeLeft] = useState(180);
  const timerRef = useRef<number | null>(null);

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
          showToast('인증 시간이 만료되었습니다.', 'error');
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

  const handleResend = async () => {
    try {
      await sendFindEmailCode({ name, phoneNumber: phone });
      setCode('');
      startTimer();
      showToast('인증번호를 재전송했습니다.', 'success');
    } catch {
      showToast('재전송에 실패했습니다.', 'error');
    }
  };

  const handleCheckCode = async () => {
    if (!code.trim()) {
      setCodeError('인증번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const res = await confirmFindEmail({ name, phoneNumber: phone, verificationCode: code });
      const result = res.data.data;

      if (!result) {
        showToast(res.data.message || '이메일 인증에 실패했습니다.', 'error');
        setIsVerified(false);
        return;
      }

      setCodeError('');
      showToast('인증에 성공하였습니다.', 'success');
      setIsVerified(true);
      onSuccess(result.email, ''); // 성공 시 부모에게 알림
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
      } else {
        setCodeError('알 수 없는 오류가 발생했습니다.');
      }
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={wrapperRef} className="w-full flex flex-col items-center">
      <div className="text-left w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-[280px] max-sm:w-full">
        <p className="text-title-4 max-xl:text-title-5 max-lg:text-title-6 max-md:text-title-6 max-sm:text-title-7">
          보내드린 <span className="font-semibold">인증번호 6자리</span>를
        </p>
        <p className="text-title-4 max-xl:text-title-5 max-lg:text-title-6 max-md:text-title-6 max-sm:text-title-7">
          입력해주세요
        </p>
      </div>

      <div className="w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-[280px] max-sm:w-full mt-[48px] max-xl:mt-[41px] max-lg:mt-[32px] max-md:mt-[36px] max-sm:mt-[28px]">
        <div className="flex items-center relative">
          <AuthInput
            name="code"
            placeholder="인증번호"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setCodeError('');
            }}
            className="pr-[110px] max-xl:pr-[94px] max-lg:pr-[71px] max-md:pr-[85px] max-sm:pr-[90px]"
          />
          <button
            type="button"
            onClick={handleCheckCode}
            disabled={loading}
            className="absolute right-[12px] max-xl:right-[10px] max-lg:right-[8px] max-md:right-[11px] max-sm:right-[12px] w-[69px] max-xl:w-[59px] max-lg:w-[44px] max-md:w-[54px] max-sm:w-[60px] h-[26px] max-xl:h-[22px] max-lg:h-[17px] max-md:h-[20px] max-sm:h-[22px] bg-purple04 text-white text-body-4 max-xl:text-body-5 max-lg:text-body-5 max-md:text-body-5 max-sm:text-body-4 rounded-[10px] max-xl:rounded-[9px] max-lg:rounded-[7px] max-md:rounded-[8px] max-sm:rounded-[9px] flex items-center justify-center"
          >
            {loading ? (
              <LoadingSpinner className="h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              '확인'
            )}
          </button>
        </div>
        {codeError && (
          <p className="w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-[280px] max-sm:w-full text-danger text-body-3 max-xl:text-body-4 max-lg:text-body-5 max-md:text-body-4 max-sm:text-body-4 mt-[6px] max-xl:mt-[5px] max-lg:mt-[4px] max-md:mt-[5px] max-sm:mt-[5px]">
            {codeError}
          </p>
        )}
      </div>

      <div className="text-body-3 max-xl:text-body-4 max-lg:text-body-5 max-md:text-body-4 max-sm:text-body-4 text-grey03 mt-[20px] max-xl:mt-[17px] max-lg:mt-[13px] max-md:mt-[15px] max-sm:mt-[16px] w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-[280px] max-sm:w-full flex items-center gap-[4px] max-xl:gap-[3px] max-lg:gap-[3px] max-md:gap-[3px] max-sm:gap-[4px]">
        <TbClock size={16} className="text-grey03" />
        <span>남은 시간</span>
        <span className="text-danger font-medium">{formatTime(timeLeft)}</span>
      </div>

      <div className="text-body-3 max-xl:text-body-4 max-lg:text-body-5 max-md:text-body-4 max-sm:text-body-4 text-grey03 mt-[13px] max-xl:mt-[11px] max-lg:mt-[9px] max-md:mt-[10px] max-sm:mt-[12px] w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-[280px] max-sm:w-full">
        인증 번호를 받지 못하셨나요?{' '}
        <button
          onClick={handleResend}
          disabled={timeLeft > 0}
          className={`font-medium ml-[4px] max-xl:ml-[3px] max-lg:ml-[3px] max-md:ml-[3px] max-sm:ml-[4px] ${
            timeLeft > 0 ? 'text-grey03 cursor-not-allowed' : 'text-purple04 cursor-pointer'
          }`}
        >
          다시 보내기
        </button>
      </div>

      <AuthButton
        label="다음"
        onClick={() => {}}
        variant={isVerified ? 'default' : 'disabled'}
        className="mt-[180px] max-xl:mt-[154px] max-lg:mt-[122px] max-md:mt-[100px] max-sm:mt-[80px]"
      />
    </div>
  );
};

export default FindEmailVerificationForm;
