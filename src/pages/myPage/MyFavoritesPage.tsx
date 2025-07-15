import MainContentWrapper from '../../features/myPage/components/MainContentWrapper';
import RightAside from '../../features/myPage/components/RightAside';

export default function MyFavoritesPage() {
  return (
    <>
      <MainContentWrapper>
        <h1 className="text-xl font-bold mb-4">찜한 혜택</h1>
        <p>내가 찜한 혜택 리스트가 들어갑니다.</p>
      </MainContentWrapper>

      <RightAside title="추천 혜택">
        <p>이 페이지에서만 보여줄 우측 콘텐츠</p>
      </RightAside>
    </>
  );
}
