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
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        widthClass="w-[624px] max-md:max-w-[calc(100%-32px)]"
      >
        <div className="relative w-full flex flex-col items-center text-center pt-10">
          <div className="absolute -top-[270px] left-1/2 -translate-x-1/2 w-[380px] h-[292px] max-sm:-top-[110px] max-sm:w-[220px] max-sm:h-[130px] max-md:w-[290px] max-md:h-[200px] max-md:-top-[190px]">
            <img src={WinTopImg} alt="당첨 일러스트" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-title-2 font-bold max-sm:text-title-5 max-sm:font-bold">
            축하드려요 잇플님!
          </h2>
          <img src={ProductImg} alt="상품 이미지" className="mt-4 w-[76px] h-[76px]" />
          <p className="text-body-0 text-[#000000] mt-4 max-sm:text-body-2">
            🎉[회사명]상품 이름에 당첨되셨어요.
          </p>
          <p className="text-body-0 text-[#000000] mt-8 max-sm:text-body-2 max-sm:mt-4 px-4">
            가입하신 이메일로 안내 메일을 보내드릴게요. 선물은 빠르게 받아보시려면 메일을
            확인해주세요! 잇플을 이용해주셔서 감사합니다!
          </p>
        </div>
      </Modal>
    </>
  );
};

export default WinModal;
