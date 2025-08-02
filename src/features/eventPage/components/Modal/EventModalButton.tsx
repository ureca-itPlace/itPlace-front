import React from 'react';

interface EventModalButtonProps {
  onClick: () => void;
  label?: string;
}

const EventModalButton: React.FC<EventModalButtonProps> = ({ onClick, label = '확인' }) => {
  return (
    <button
      onClick={onClick}
      className="w-[250px] max-w-[250px] mt-6 px-11 pb-4 pt-5 rounded-[10px] bg-purple04 text-white text-title-6 hover:bg-purple05 transition max-sm:text-title-8 max-sm:mt-3 max-sm:pt-4 max-sm:pb-3"
    >
      {label}
    </button>
  );
};

export default EventModalButton;
