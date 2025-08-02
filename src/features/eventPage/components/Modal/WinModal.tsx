import React, { useEffect, useRef } from 'react';
import Modal from '../../../../components/Modal';
import WinTopImg from '/images/event/modal-win.webp';
import ProductImg from '/images/admin/CGV.png';
import { entranceAnimation } from '../../../../utils/Animation';

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  giftName: string;
  productImageUrl: string;
}

const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  onClose,
  username,
  giftName,
  productImageUrl,
}) => {
  const winModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && winModalRef.current) {
      // 애니메이션 적용
      entranceAnimation.bounceToFront(winModalRef.current);
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        widthClass="w-[624px] max-md:max-w-[calc(100%-32px)]"
      >
        <div
          ref={winModalRef}
          className="relative w-full flex flex-col items-center text-center pt-10"
        >
          <div className="absolute -top-[270px] left-1/2 -translate-x-1/2 w-[380px] h-[292px] max-sm:-top-[110px] max-sm:w-[220px] max-sm:h-[130px] max-md:w-[290px] max-md:h-[200px] max-md:-top-[190px] max-xl:w-[250px] max-xl:h-[160px] max-xl:-top-[150px]">
            <img src={WinTopImg} alt="당첨 일러스트" className="w-full h-full object-contain" />
          </div>
          {/* 사용자 이름 */}
          <h2 className="text-title-2 font-bold max-sm:text-title-5 max-sm:font-bold max-xl:text-title-3">
            축하드려요 {username}님!
          </h2>
          <img
            src={productImageUrl || ProductImg}
            alt="상품 이미지"
            className="mt-4 w-[76px] h-[76px]"
          />
          {/* 상품 이름 */}
          <p className="text-body-0 text-[#000000] mt-4 max-sm:text-body-2 max-xl:text-body-1">
            🎉{giftName}에 당첨되셨어요.
          </p>
          <p className="text-body-0 text-[#000000] mt-8 max-sm:text-body-2 max-sm:mt-4 max-xl:text-body-1 px-4">
            가입하신 이메일로 안내 메일을 보내드릴게요. 선물은 빠르게 받아보시려면 메일을
            확인해보세요! 잇플을 이용해주셔서 감사합니다!
          </p>
        </div>
      </Modal>
    </>
  );
};

export default WinModal;
