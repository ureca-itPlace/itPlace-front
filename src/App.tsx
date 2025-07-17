// src/App.tsx
import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import ToastProvider from './components/ToastProvider';

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastProvider />
    </>
  );
};

export default App;
