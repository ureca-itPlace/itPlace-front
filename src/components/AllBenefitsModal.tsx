import React from 'react';
import { TbX } from 'react-icons/tb';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center p-4 max-md:p-2"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] relative overflow-hidden w-full h-full max-w-[800px] max-h-[664px] max-md:max-w-[340px] max-md:max-h-[80vh] max-md:rounded-[16px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="bg-grey01 rounded-t-[20px] max-md:rounded-t-[16px] flex items-center justify-between pl-8 max-md:pl-4 pt-6 max-md:pt-4 pb-4 max-md:pb-3 pr-4 max-md:pr-3">
          <h3 className="text-title-5 max-md:text-title-7">{title}</h3>
          <button onClick={onClose} className="text-grey05">
            <TbX size={36} className="max-md:w-8 max-md:h-8" />
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
