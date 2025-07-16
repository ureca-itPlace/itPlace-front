import { ReactNode } from 'react';

interface MainContentWrapperProps {
  children: ReactNode;
}

export default function MainContentWrapper({ children }: MainContentWrapperProps) {
  return (
    <main className="flex flex-1 flex-col h-full bg-white rounded-[18px] drop-shadow-basic pt-[76px] pb-[56px] pl-[56px] pr-[56px]">
      {children}
    </main>
  );
}
