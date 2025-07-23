import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const images = ['/images/allBenefits/event1.png', '/images/allBenefits/event2.png'];

const EventBanner: React.FC = () => {
  return (
    <div className="rounded-[18px] drop-shadow-basic flex items-center justify-center w-[1200px] h-[250px] max-md:w-full max-md:h-[100px] max-md:rounded-none max-md:drop-shadow-none">
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
        className="rounded-[12px] w-full h-full max-md:rounded-none"
      >
        {images.map((src, idx) => (
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
                className="object-fill rounded-[12px] w-full h-full max-md:rounded-none"
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
