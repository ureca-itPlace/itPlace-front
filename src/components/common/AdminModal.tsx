import React from 'react';
import { TbX } from 'react-icons/tb';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = 800,
  height = 664,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] relative overflow-hidden"
        style={{ width, height }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="bg-grey01 rounded-t-[20px] flex items-center justify-between pl-8 pt-6 pb-4 pr-4">
          <h3 className="text-title-5  ">{title}</h3>
          <button onClick={onClose} className="text-grey05">
            <TbX size={36} />
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="bg-white overflow-y-auto" style={{ height: 'calc(100% - 88px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
