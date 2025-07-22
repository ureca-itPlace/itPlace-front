import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const images = ['/images/allBenefits/event1.png', '/images/allBenefits/event2.png'];

const EventBanner: React.FC = () => {
  return (
    <div className="rounded-[18px] drop-shadow-basic flex items-center justify-center w-[1200px] h-[250px] max-md:w-[calc(100vw-56px)] max-md:h-[100px]">
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
        style={{ width: 1200, height: 250 }}
        className="rounded-[12px]"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <a
              href={
                idx === 0 ? 'https://www.lguplus.com/ujam/95' : 'https://www.lguplus.com/ujam/155'
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', width: '100%', height: '100%' }}
            >
              <img
                src={src}
                alt={`benefit-${idx + 1}`}
                className="object-contain rounded-[12px]"
                style={{ width: 1200, height: 250 }}
              />
            </a>
          </SwiperSlide>
        ))}

        {/* 페이지네이션 */}
        <div className="swiper-pagination !bottom-2"></div>
      </Swiper>
    </div>
  );
};

export default EventBanner;
