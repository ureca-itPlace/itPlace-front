import { useState } from 'react';
import PhoneAuth from '../common/PhoneAuth';
import { sendFindEmailCode, confirmFindEmail } from '../../apis/user';
import { showToast } from '../../../../utils/toast';

type Props = {
  onSuccess: (email: string, createdAt: string) => void;
  onClickTabPassword: () => void;
};

const FindEmailStep1 = ({ onSuccess, onClickTabPassword }: Props) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!name.trim() || !phone.trim()) {
      showToast('이름과 전화번호를 모두 입력해주세요.', 'error');
      return;
    }

    const payload = { name, phoneNumber: phone };
    console.log('[📤 인증번호 요청] payload:', payload); // 🔍 여기에 찍힘

    try {
      await sendFindEmailCode(payload);
      setCodeSent(true);
      showToast('인증번호가 전송되었습니다.', 'success');
    } catch (err) {
      console.error('[❌ 인증번호 요청 실패]', err);
      showToast('인증번호 전송에 실패했습니다.', 'error');
    }
  };

  const handleConfirm = async () => {
    if (!code.trim()) {
      showToast('인증번호를 입력해주세요.', 'error');
      return;
    }

    const payload = {
      name,
      phoneNumber: phone,
      verificationCode: code,
    };
    console.log('[📤 인증번호 확인 요청] payload:', payload); // 🔍 여기에 찍힘

    setLoading(true);
    try {
      const res = await confirmFindEmail(payload);
      console.log('[✅ 인증 확인 응답]', res.data); // 🔍 응답 확인

      const result = res.data.data;
      if (!result) {
        showToast(res.data.message || '이메일 인증에 실패했습니다.', 'error');
        return;
      }

      onSuccess(result.email, '');
    } catch (err: any) {
      console.error('[❌ 인증 확인 실패]', err);
      const msg = err?.response?.data?.message || '이메일 인증 중 오류가 발생했습니다.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <PhoneAuth
        name={name}
        phone={phone}
        onChangeName={setName}
        onChangePhone={setPhone}
        onSubmit={handleSendCode}
        showTab={true}
        showCaptcha={false}
        title=""
        submitLabel={codeSent ? '재전송' : '인증번호 받기'}
        onClickTabPassword={onClickTabPassword}
      />

      {codeSent && (
        <>
          <div className="w-[320px] mt-[20px]">
            <input
              type="text"
              className="w-full border border-grey03 rounded px-4 py-2"
              placeholder="인증번호 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="w-[320px] mt-[20px]">
            <button
              className="w-full h-[50px] bg-purple04 text-white rounded"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? '확인 중...' : '인증번호 확인'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FindEmailStep1;
