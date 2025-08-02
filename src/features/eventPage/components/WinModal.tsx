import React from 'react';
import Modal from '../../../components/Modal';
import WinTopImg from '/images/event/modal-win.webp';
import ProductImg from '/images/admin/CGV.png';

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} widthClass="w-[624px]">
        <div className="relative w-full flex flex-col items-center text-center pt-10">
          <img
            src={WinTopImg}
            alt="당첨 일러스트"
            className="absolute -top-[80%] left-1/2 -translate-x-1/2 w-[380px] h-[292px]"
          />
          <h2 className="text-title-2 font-bold">축하드려요 잇플님!</h2>
          <img src={ProductImg} alt="상품 이미지" className="mt-4 w-[76px] h-[76px]" />
          <p className="text-body-0 text-[#000000] mt-4">🎉[회사명]상품 이름에 당첨되셨어요.</p>
          <p className="text-body-0 text-[#000000] mt-8">
            가입하신 이메일로 안내 메일을 보내드릴게요.
            <br />
            선물은 빠르게 받아보시려면 메일을 확인해주세요!
            <br />
            잇플을 이용해주셔서 감사합니다!
          </p>
        </div>
      </Modal>
    </>
  );
};

export default WinModal;
