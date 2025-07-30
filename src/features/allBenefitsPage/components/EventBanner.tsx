import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const images = ['/images/allBenefits/event1.png', '/images/allBenefits/event2.png'];
const images2 = ['/images/allBenefits/event1-1.png', '/images/allBenefits/event2-2.png'];

const EventBanner: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767); // max-sm 기준
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderImages = isMobile ? images2 : images;

  return (
    <div className="rounded-[18px] max-xl:rounded-[14px] drop-shadow-basic flex items-center justify-center w-[1190px] max-xl:w-[950px] h-[250px] max-xl:h-[200px] max-md:w-full max-md:h-[100px] max-md:rounded-none max-md:drop-shadow-none">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="rounded-[12px] max-xl:rounded-[10px] w-full h-full max-md:rounded-none"
      >
        {renderImages.map((src, idx) => (
          <SwiperSlide key={idx}>
            <a
              href={
                idx === 0 ? 'https://www.lguplus.com/ujam/95' : 'https://www.lguplus.com/ujam/155'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <img
                src={src}
                alt={`benefit-${idx + 1}`}
                className="object-fill rounded-[12px] max-xl:rounded-[10px] w-full h-full max-md:rounded-none max-md:object-cover"
              />
            </a>
          </SwiperSlide>
        ))}

        {/* 페이지네이션 */}
        <div className="swiper-pagination !bottom-2 max-md:hidden"></div>
      </Swiper>
    </div>
  );
};

export default EventBanner;
