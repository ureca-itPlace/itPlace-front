import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import AuthInput from '../common/AuthInput';
import AuthButton from '../common/AuthButton';
import { TbClock } from 'react-icons/tb';
import { confirmFindEmail, sendFindEmailCode } from '../../apis/user';
import { showToast } from '../../../../utils/toast';

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
      <div className="text-left w-[320px]">
        <p className="text-title-4">
          보내드린 <span className="font-semibold">인증번호 6자리</span>를
        </p>
        <p className="text-title-4">입력해주세요</p>
      </div>

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
            disabled={loading}
            className="absolute right-[12px] w-[69px] h-[26px] bg-purple04 text-white text-body-4 rounded-[10px]"
          >
            {loading ? '확인중' : '확인'}
          </button>
        </div>
        {codeError && <p className="w-[320px] text-danger text-body-3 mt-[6px]">{codeError}</p>}
      </div>

      <div className="text-body-3 text-grey03 mt-[20px] w-[320px] flex items-center gap-[4px]">
        <TbClock size={16} className="text-grey03" />
        <span>남은 시간</span>
        <span className="text-danger font-medium">{formatTime(timeLeft)}</span>
      </div>

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

      <AuthButton
        label="다음"
        onClick={() => {}}
        variant={isVerified ? 'default' : 'disabled'}
        className="mt-[180px]"
      />
    </div>
  );
};

export default FindEmailVerificationForm;
