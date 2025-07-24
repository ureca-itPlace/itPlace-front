import { forwardRef } from 'react';

const BlackSquare = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 w-full h-screen bg-[#000000] z-20"
      style={{ willChange: 'transform' }}
    ></div>
  );
});

export default BlackSquare;
