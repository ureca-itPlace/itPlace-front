import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { TbX } from 'react-icons/tb';
import { entranceAnimation } from '../utils/Animation';

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
  inputType?: string;
  widthClass?: string;
  animateOnOpen?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  subMessage = '',
  subMessageClass = '',
  input = false,
  inputType = 'text',
  inputValue = '',
  inputPlaceholder = '',
  onInputChange,
  onClose,
  buttons = [],
  children,
  widthClass,
  animateOnOpen,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && animateOnOpen && modalRef.current) {
      entranceAnimation.bounceToFront(modalRef.current);
    }
  }, [isOpen, animateOnOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`relative ${widthClass ?? 'w-full max-w-[500px]'} bg-white rounded-[20px] shadow-xl p-10 flex flex-col items-center max-sm:p-5`}
      >
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-5 right-5 text-grey03 hover:text-grey04">
          <TbX size={24} />
        </button>

        {/* 제목 */}
        {title && (
          <h2 className="text-title-4 font-bold text-black text-center w-full max-sm:text-title-6 max-sm:font-bold">
            {title}
          </h2>
        )}

        {/* 메시지 */}
        {message && (
          <p className="text-body-0 text-black whitespace-pre-line text-center mt-[16px] w-full max-sm:text-body-2">
            {message}
          </p>
        )}

        {/* 서브 메시지 */}
        {subMessage && (
          <p
            className={`text-center text-black w-full mt-[8px] text-body-0 whitespace-pre-line max-sm:text-body-2 ${subMessageClass}`}
          >
            {subMessage}
          </p>
        )}

        {/* 입력창 */}
        {input && (
          <input
            type={inputType}
            className="w-full max-w-[436px] h-[50px] mt-[20px] px-[20px] bg-grey01 rounded-[10px] text-body-2 text-grey05 placeholder-grey03 max-sm:text-body-3"
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={(e) => onInputChange?.(e.target.value)}
          />
        )}

        {/* 하단 자식 요소 */}
        {children && <div className="mt-[20px] w-full flex justify-center">{children}</div>}

        {/* 버튼 영역 */}
        {buttons.length > 0 && (
          <div className="mt-[20px] w-full flex gap-4 max-sm:gap-3">
            {buttons.map((btn, idx) => {
              const typeClass =
                btn.type === 'primary'
                  ? 'bg-purple04 text-white hover:bg-purple05'
                  : 'border border-grey02 text-grey04 hover:text-grey05 hover:border-grey04';

              return (
                <button
                  key={idx}
                  className={`flex-1 h-[56px] rounded-[10px] text-title-6 transition duration-200 ${typeClass} max-xl:h-[52px] max-sm:h-[46px] max-sm:text-title-7`}
                  onClick={btn.onClick}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>,
    document.body // ✅ 포탈 적용
  );
};

export default Modal;
