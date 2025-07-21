import Modal from '../../../../components/Modal';

interface PasswordChangeModalProps {
  isOpen: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onCurrentChange: (val: string) => void;
  onNewChange: (val: string) => void;
  onConfirmChange: (val: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function PasswordChangeModal({
  isOpen,
  currentPassword,
  newPassword,
  confirmPassword,
  onCurrentChange,
  onNewChange,
  onConfirmChange,
  onCancel,
  onSubmit,
}: PasswordChangeModalProps) {
  const isReady =
    currentPassword.trim() !== '' && newPassword.trim() !== '' && confirmPassword.trim() !== '';

  return (
    <Modal
      isOpen={isOpen}
      title="비밀번호를 재설정합니다"
      message="현재 비밀번호와 새 비밀번호를 입력해주세요."
      onClose={onCancel}
    >
      {/* ✅ 이 div 안에 인풋들과 버튼을 모두 넣고 flex-col로 정렬 */}
      <div className="flex flex-col items-center gap-4 w-full max-w-[436px] mt-4">
        {/* 인풋 영역 */}
        <div className="flex flex-col gap-3 w-full">
          <input
            type="password"
            className="w-full h-[50px] px-4 bg-grey01 rounded-[10px] text-body-2 placeholder-grey03"
            placeholder="현재 비밀번호 입력"
            value={currentPassword}
            onChange={(e) => onCurrentChange(e.target.value)}
          />
          <input
            type="password"
            className="w-full h-[50px] px-4 bg-grey01 rounded-[10px] text-body-2 placeholder-grey03"
            placeholder="새 비밀번호 입력"
            value={newPassword}
            onChange={(e) => onNewChange(e.target.value)}
          />
          <input
            type="password"
            className="w-full h-[50px] px-4 bg-grey01 rounded-[10px] text-body-2 placeholder-grey03"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => onConfirmChange(e.target.value)}
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-4 w-full mt-4">
          <button
            onClick={onCancel}
            className="flex-1 h-[56px] rounded-[10px] border border-grey02 text-grey04 hover:text-grey05"
          >
            취소
          </button>
          <button
            onClick={() => {
              if (!isReady) return;
              onSubmit();
            }}
            disabled={!isReady}
            className={`flex-1 h-[56px] rounded-[10px] text-title-6 transition duration-200 ${
              isReady
                ? 'bg-purple04 text-white hover:bg-purple05'
                : 'bg-grey01 text-grey03 cursor-not-allowed'
            }`}
          >
            변경하기
          </button>
        </div>
      </div>
    </Modal>
  );
}
