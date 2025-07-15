import { ReactNode } from 'react';

interface RightAsideProps {
  title: string;
  children: ReactNode;
}

export default function RightAside({ title, children }: RightAsideProps) {
  return (
    <aside className="w-[476px] bg-white rounded-[18px] drop-shadow-basic pt-[76px] pb-[56px] px-[40px]">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </aside>
  );
}
