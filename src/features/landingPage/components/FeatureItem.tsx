import React from 'react';
import { useResponsive } from '../../../hooks/useResponsive';
import { FeatureItemProps } from '../types/landing.types';

const FeatureItem: React.FC<FeatureItemProps> = ({
  reverse = false,
  imageSrc,
  alt,
  title,
  description,
  imageRef,
  number,
}) => {
  const { isMobile, isTablet } = useResponsive();

  const isVertical = isMobile || isTablet;
  const layoutDirection = isVertical ? 'flex-col' : reverse ? 'flex-row-reverse' : 'flex-row';

  return (
    <div
      className={`flex items-center justify-center h-[90vh] gap-6 max-sm:h-[80vh] z-10 ${
        layoutDirection
      } ${isVertical ? 'gap-10' : ''}`}
    >
      {/* 이미지 영역 */}
      <div className="flex justify-center items-center w-1/2 h-full px-3 max-lg:w-full max-lg:h-fit max-lg:px-0">
        <img
          ref={imageRef}
          src={imageSrc}
          alt={alt}
          className="feature-image w-auto h-auto max-h-[80vh] object-contain"
        />
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col justify-center text-white text-left w-[40%] h-full pt-0 gap-12 px-12 max-lg:text-center max-lg:px-2 max-lg:w-full max-lg:h-fit max-lg:pt-4 max-lg:gap-6">
        {number !== undefined && (
          <span className="feature-index text-white text-5xl font-bold max-xl:text-4xl">
            {number.toString().padStart(2, '0')}
          </span>
        )}
        <h1 className="feature-title text-4xl font-bold leading-normal max-xl:text-3xl max-sm:text-2xl max-xl:leading-normal max-md:leading-normal max-sm:leading-normal">
          {title}
        </h1>
        <h4 className="feature-desc text-2xl leading-loose max-xl:text-xl max-xl:leading-loose max-lg:leading-loose max-md:leading-relaxed max-sm:leading-relaxed">
          {description}
        </h4>
      </div>
    </div>
  );
};

export default FeatureItem;
