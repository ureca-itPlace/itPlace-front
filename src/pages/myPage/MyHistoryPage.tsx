import MainContentWrapper from '../../features/myPage/components/MainContentWrapper';
import RightAside from '../../features/myPage/components/RightAside';

export default function MyHistoryPage() {
  return (
    <>
      <MainContentWrapper>
        <h1 className="text-xl font-bold mb-4">이용 내역</h1>
        <p>혜택 이용 내역이 표시됩니다.</p>
      </MainContentWrapper>

      <RightAside bottomImage="/images/myPage/bunny-history.png" bottomImageAlt="혜택 이력 토끼">
        <h1 className="text-xl font-bold mb-4">이용 통계</h1>
        <p>우측 영역에 관련 통계나 그래프 등</p>
      </RightAside>
    </>
  );
}
