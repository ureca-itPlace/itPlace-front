import React, { useEffect, useRef } from 'react';
import Modal from '../../../../components/Modal';
import FailTopImg from '/images/event/modal-fail.webp';
import { entranceAnimation } from '../../../../utils/Animation';

interface FailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FailModal: React.FC<FailModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // 애니메이션 적용
      entranceAnimation.bounceToFront(modalRef.current);
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
          ref={modalRef}
          className="relative w-full flex flex-col items-center text-center pt-10"
        >
          <div className="absolute -top-[270px] left-1/2 -translate-x-1/2 w-[380px] h-[292px] max-xl:w-[280px] max-xl:h-[190px] max-xl:-top-[170px] max-sm:-top-[130px] max-sm:w-[150px] max-sm:h-[150px]">
            <img src={FailTopImg} alt="꽝 일러스트" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-title-2 font-bold max-sm:text-title-5 max-sm:font-bold max-xl:text-title-3">
            꽝! 다음 기회에
          </h2>
          <p className="text-body-0 text-[#000000] mt-8 max-sm:text-body-2 max-sm:mt-4 max-xl:text-body-1">
            다음 기회를 노려보세요😢
            <br />
            잇플을 이용해주셔서 감사합니다!
          </p>
        </div>
      </Modal>
    </>
  );
};

export default FailModal;
