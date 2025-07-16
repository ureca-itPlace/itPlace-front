import { useEffect, useState } from 'react';

interface FadeWrapperProps {
  /** key값이 바뀔 때마다 애니메이션 */
  changeKey: string | number | boolean | null; //내용이 바뀔 때마다 변하는 값을 넣어줌. (예: 탭 이름, 선택된 benefitId 등)
  children: React.ReactNode;
}

export default function FadeWrapper({ changeKey, children }: FadeWrapperProps) {
  const [animClass, setAnimClass] = useState('translate-y-0');

  useEffect(() => {
    // 사라지는 상태
    setAnimClass('translate-y-2'); // 살짝 아래로 내리고 투명
    const timeout = setTimeout(() => {
      // 나타나는 상태
      setAnimClass('translate-y-0');
    }, 200); // 짧은 지연 후 애니메이션 시작
    return () => clearTimeout(timeout);
  }, [changeKey]);

  return <div className={`transition-all duration-300 ease-in-out ${animClass}`}>{children}</div>;
}
