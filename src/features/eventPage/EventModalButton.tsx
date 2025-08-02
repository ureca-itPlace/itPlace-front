import React from 'react';

interface EventModalButtonProps {
  onClick: () => void;
  label?: string;
}

const EventModalButton: React.FC<EventModalButtonProps> = ({ onClick, label = '확인' }) => {
  return (
    <button
      onClick={onClick}
      className="w-[250px] mt-6 px-11 pb-4 pt-5 rounded-[10px] bg-purple04 text-white text-title-6 hover:bg-purple05 transition"
    >
      {label}
    </button>
  );
};

export default EventModalButton;
