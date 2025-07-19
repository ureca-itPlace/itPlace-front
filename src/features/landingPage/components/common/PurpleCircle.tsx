import { forwardRef } from 'react';

const PurpleCircle = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="circle w-[80vw] h-[80vw] rounded-full bg-purple04 fixed top-1/2 left-1/2 
      -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
    />
  );
});

export default PurpleCircle;
