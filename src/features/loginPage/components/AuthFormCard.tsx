import { ReactNode } from 'react';

export type RadiusOption = 'all' | 'right' | 'left' | 'none';

type Props = {
  children: ReactNode;
  radius?: RadiusOption;
};

const getRadiusClass = (radius: RadiusOption) => {
  switch (radius) {
    case 'right':
      return 'rounded-tr-[30px] rounded-br-[30px]';
    case 'left':
      return 'rounded-tl-[30px] rounded-bl-[30px]';
    case 'none':
      return 'rounded-none';
    case 'all':
    default:
      return 'rounded-[30px]';
  }
};

const AuthFormCard = ({ children, radius = 'all' }: Props) => {
  const radiusClass = getRadiusClass(radius);

  return (
    <div
      className={`w-[583px] h-[639px] bg-white shadow-lg flex flex-col items-center justify-center px-[100px] ${radiusClass}`}
    >
      {children}
    </div>
  );
};

export default AuthFormCard;
