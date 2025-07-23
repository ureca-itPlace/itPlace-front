import { forwardRef } from 'react';

const PurpleCircle = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="w-32 h-32 rounded-full bg-purple04 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
    />
  );
});

export default PurpleCircle;
