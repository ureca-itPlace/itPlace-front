import { ReactNode } from 'react';

interface RightAsideProps {
  children: ReactNode;
}

export default function RightAside({ children }: RightAsideProps) {
  return (
    <aside className="w-[476px] bg-white rounded-[18px] drop-shadow-basic pt-[76px] pb-[56px] px-[40px]">
      {children}
    </aside>
  );
}
