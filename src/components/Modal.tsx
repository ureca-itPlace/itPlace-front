import React, { useRef } from 'react';
import { TbX } from 'react-icons/tb';

interface ButtonType {
  label: string;
  onClick?: () => void;
  type?: 'primary' | 'secondary';
}

interface ModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  subMessage?: string;
  subMessageClass?: string;
  input?: boolean;
  inputValue?: string;
  inputPlaceholder?: string;
  onInputChange?: (value: string) => void;
  onClose: () => void;
  buttons?: ButtonType[];
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  subMessage = '',
  subMessageClass = '',
  input = false,
  inputValue = '',
  inputPlaceholder = '',
  onInputChange,
  onClose,
  buttons = [],
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="relative w-[500px] bg-white rounded-[20px] shadow-xl px-10 py-12 flex flex-col items-center"
      >
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-5 right-5 text-grey03 hover:text-grey04">
          <TbX size={24} />
        </button>

        {/* 제목 */}
        {title && <h2 className="text-title-4 font-bold text-black text-center w-full">{title}</h2>}

        {/* 메시지 */}
        {message && (
          <p className="text-body-0 text-black whitespace-pre-line text-center mt-[16px] w-full">
            {message}
          </p>
        )}

        {/* 서브 메시지 */}
        {subMessage && <p className={`text-center w-full ${subMessageClass}`}>{subMessage}</p>}

        {/* 입력창 */}
        {input && (
          <input
            type="text"
            className="w-full max-w-[436px] h-[50px] mt-[20px] px-[20px] bg-grey01 rounded-[10px] text-body-2 text-grey05 placeholder-grey03"
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={(e) => onInputChange?.(e.target.value)}
          />
        )}

        {/* 하단 자식 요소 */}
        {children && <div className="mt-[32px] w-full flex justify-center">{children}</div>}

        {/* 버튼 영역 */}
        {buttons.length > 0 && (
          <div className="mt-[20px] w-full flex gap-4">
            {buttons.map((btn, idx) => {
              const typeClass =
                btn.type === 'primary'
                  ? 'bg-purple04 text-white hover:bg-purple05'
                  : 'border border-grey02 text-grey04 hover:text-grey05 hover:border-grey04';

              return (
                <button
                  key={idx}
                  className={`flex-1 h-[56px] rounded-[10px] text-title-6  transition duration-200 ${typeClass}`}
                  onClick={btn.onClick}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

// * 공통 Modal 컴포넌트
// *
// * 사용법 예시:
// *
// * const [modal, setModal] = useState({
// *   isOpen: true,
// *   title: '타이틀 텍스트',
// *   message: '본문 메시지',
// *   subMessage: '서브 메시지 (선택)',
// *   subMessageClass: '텍스트 클래스명 (선택)',
// *   buttons: [
// *     { label: '취소', onClick: handleCancel, type: 'secondary' },
// *     { label: '확인', onClick: handleConfirm, type: 'primary' }
// *   ]
// * });
// *
// * <Modal
// *   isOpen={modal.isOpen}
// *   title={modal.title}
// *   message={modal.message}
// *   subMessage={modal.subMessage}
// *   subMessageClass={modal.subMessageClass}
// *   buttons={modal.buttons}
// *   onClose={handleClose}
// * />
// *
// * 주요 props:
// * - isOpen: 모달 열림 여부
// * - title: 상단 제목
// * - message: 본문 내용 (줄바꿈 지원)
// * - subMessage: 작은 서브 메시지 (선택)
// * - subMessageClass: 서브 메시지에 적용할 클래스명
// * - input: 입력 필드 표시 여부
// * - inputValue / inputPlaceholder / onInputChange: 입력 관련 속성
// * - buttons: 하단 버튼 배열 (label, onClick, type: 'primary' | 'secondary')
// * - children: 커스텀 내용 삽입 가능
// * - onClose: 외부 클릭 또는 닫기 버튼 클릭 시 실행 함수
// */
