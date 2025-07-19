// src/components/common/ToastProvider.tsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastProvider: React.FC = () => {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={3000}
      hideProgressBar={true}
      closeOnClick
      pauseOnHover
      draggable
      limit={1}
    />
  );
};

export default ToastProvider;
