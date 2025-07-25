import { ReactNode } from 'react';

export type RadiusOption = 'all' | 'right' | 'left' | 'none';

type Props = {
  children: ReactNode;
  radius?: RadiusOption;
};

const getRadiusClass = (radius: RadiusOption) => {
  switch (radius) {
    case 'right':
      return 'rounded-tr-[30px] max-xl:rounded-tr-[26px] max-lg:rounded-tr-[20px] max-md:rounded-tr-[18px] max-sm:rounded-tr-[16px] rounded-br-[30px] max-xl:rounded-br-[26px] max-lg:rounded-br-[20px] max-md:rounded-br-[18px] max-sm:rounded-br-[16px]';
    case 'left':
      return 'rounded-tl-[30px] max-xl:rounded-tl-[26px] max-lg:rounded-tl-[20px] max-md:rounded-tl-[18px] max-sm:rounded-tl-[16px] rounded-bl-[30px] max-xl:rounded-bl-[26px] max-lg:rounded-bl-[20px] max-md:rounded-bl-[18px] max-sm:rounded-bl-[16px]';
    case 'none':
      return 'rounded-none';
    case 'all':
    default:
      return 'rounded-[30px] max-xl:rounded-[26px] max-lg:rounded-[20px] max-md:rounded-[18px] max-sm:rounded-[16px]';
  }
};

const AuthFormCard = ({ children, radius = 'all' }: Props) => {
  const radiusClass = getRadiusClass(radius);

  return (
    <div
      className={`w-[583px] max-xl:w-[500px] max-lg:w-[375px] max-md:w-full max-sm:w-full h-[639px] max-xl:h-[548px] max-lg:h-[430px] max-md:h-auto max-sm:h-auto bg-white drop-shadow-basic flex flex-col items-center justify-center ${radiusClass}`}
    >
      {children}
    </div>
  );
};

export default AuthFormCard;
