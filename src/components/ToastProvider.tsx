// src/components/common/ToastProvider.tsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastProvider: React.FC = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={true}
      closeButton={false}
      closeOnClick
      pauseOnHover
      draggable
      limit={1}
      className="custom-toast-container"
    />
  );
};

export default ToastProvider;
