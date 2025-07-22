import React from 'react';

interface InfoBannerSectionProps {
  message: string;
  variant?: 'primary' | 'secondary';
}

const InfoBannerSection: React.FC<InfoBannerSectionProps> = ({ message, variant = 'primary' }) => {
  const borderColor = variant === 'primary' ? 'border-purple04' : 'border-grey02';
  const textColor = variant === 'primary' ? 'text-purple04' : 'text-grey05';

  return (
    <div className={`border ${borderColor} rounded-[10px] mt-5`}>
      <div className={`${textColor} py-3 text-center text-body-2`}>{message}</div>
    </div>
  );
};

export default InfoBannerSection;
