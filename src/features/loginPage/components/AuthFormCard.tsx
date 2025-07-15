import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const AuthFormCard = ({ children }: Props) => {
  return (
    <div className="w-[583px] h-[639px] rounded-[30px] bg-white shadow-lg flex flex-col items-center justify-center gap-[16px] px-[40px]">
      {children}
    </div>
  );
};

export default AuthFormCard;
