import React from 'react';
import Modal from '../../../../components/Modal';
import NoCouponTopImg from '/images/event/empty-box.webp';
import EventModalButton from './EventModalButton';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '../../../../hooks/useResponsive';

interface FailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FailModal: React.FC<FailModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isTablet } = useResponsive();
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        widthClass="w-[624px] max-md:max-w-[calc(100%-32px)]"
        animateOnOpen
      >
        <div className="flex flex-col items-center text-center">
          <div className="absolute -top-[210px] left-1/2 -translate-x-1/2 w-[380px] h-[292px] max-sm:-top-[110px] max-sm:w-[220px] max-sm:h-[150px] max-md:w-[290px] max-md:h-[200px] max-md:-top-[130px] max-xl:w-[250px] max-xl:h-[180px] max-xl:-top-[120px]">
            <img
              src={NoCouponTopImg}
              alt="빈 상자 일러스트"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-title-4 font-bold pt-2 max-sm:text-title-7 max-sm:font-bold">
            앗 보유하신 쿠폰이 없어요!
          </h2>
          <p className="text-body-0 text-[#000000] mt-2 max-sm:text-body-3 max-sm:leading-none max-sm:mb-4">
            지도에서{' '}
            <strong>
              <img src="/images/event/event-star.png" className="inline-block w-8 mb-1" />
            </strong>
            을 찾아 해당 혜택에 사용 이력을 등록하면
            {isTablet ? '' : <br />} 쿠폰을 얻을 수 있어요.
          </p>
          <EventModalButton onClick={() => navigate('/main')} label="별 찾으러 가기" />
        </div>
      </Modal>
    </>
  );
};

export default FailModal;
