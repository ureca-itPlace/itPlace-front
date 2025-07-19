import { forwardRef } from 'react';

const BlackSquare = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 h-screen bg-black"
      style={{ width: '0%', zIndex: 10 }}
    ></div>
  );
});

export default BlackSquare;
