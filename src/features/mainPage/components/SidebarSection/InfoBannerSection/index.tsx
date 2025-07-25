import React from 'react';

interface InfoBannerSectionProps {
  message: string;
  variant?: 'primary' | 'secondary';
  highlightText?: string; // 강조할 텍스트
}

const InfoBannerSection: React.FC<InfoBannerSectionProps> = ({
  message,
  variant = 'primary',
  highlightText,
}) => {
  const borderColor = variant === 'primary' ? 'border-purple04' : 'border-grey02';
  const textColor = variant === 'primary' ? 'text-purple04' : 'text-grey05';

  // 강조 텍스트가 있으면 해당 부분을 분리하여 렌더링
  const renderMessage = () => {
    if (!highlightText || !message.includes(highlightText)) {
      return <span className={`${textColor} text-body-2 max-md:text-body-3`}>{message}</span>;
    }

    // 강조할 텍스트를 기준으로 메시지를 분할
    const parts = message.split(highlightText);

    return (
      <span className={`${textColor} text-body-2 max-md:text-body-3`}>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="text-purple05 text-body-2-bold max-md:text-body-3-bold">
                {highlightText}
              </span>
            )}
          </React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <div className={`border ${borderColor} rounded-[10px] mt-5 max-md:mt-3`}>
      <div className="py-3 text-center max-md:py-2">{renderMessage()}</div>
    </div>
  );
};

export default InfoBannerSection;
