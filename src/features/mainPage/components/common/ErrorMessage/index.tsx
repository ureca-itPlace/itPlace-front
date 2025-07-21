import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = '오류 발생', 
  message, 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-red-500 text-center mb-2 font-medium">{title}</div>
      <div className="text-grey04 text-sm text-center mb-4">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-purple04 text-white rounded-lg hover:bg-purple05 transition-colors duration-200"
        >
          다시 시도
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;