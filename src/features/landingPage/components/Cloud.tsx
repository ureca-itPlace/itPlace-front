import { forwardRef } from 'react';

interface CloudProps {
  className?: string;
}

const Cloud = forwardRef<HTMLImageElement, CloudProps>(({ className = '' }, ref) => {
  return (
    <div className={`absolute w-[120vw] h-[120vh] z-20 ${className} pointer-events-none z-50`}>
      <img
        ref={ref}
        src="/images/landing/cloud.webp"
        alt="구름"
        className="object-contain w-full h-full absolute"
      />
    </div>
  );
});

export default Cloud;
