import React, { useRef } from 'react';
import { TbX } from 'react-icons/tb';

interface ButtonType {
  label: string;
  onClick: () => void;
  type?: 'primary' | 'secondary';
}

interface ModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
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
        {/* X 아이콘 */}
        <button onClick={onClose} className="absolute top-5 right-5 text-grey03 hover:text-grey04">
          <TbX size={24} />
        </button>

        {/* 제목 */}
        {title && <h2 className="text-title-4 font-bold text-black text-center w-full">{title}</h2>}

        {/* 본문 */}
        {message && (
          <p className="text-body-0 text-black whitespace-pre-line text-center mt-[16px] w-full">
            {message}
          </p>
        )}

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

        {/* 하단 글 영역 */}
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
