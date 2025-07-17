import MainContentWrapper from '../../features/myPage/components/MainContentWrapper';
import RightAside from '../../features/myPage/components/RightAside';
import FadeWrapper from '../../features/myPage/components/FadeWrapper';

export default function MyInfoPage() {
  return (
    <>
      <MainContentWrapper>
        <h1 className="text-xl font-bold mb-4">내 정보</h1>
        <p>여기에 내 회원 정보가 들어갑니다.</p>
      </MainContentWrapper>

      <RightAside
        bottomImage="/images/myPage/bunny-info.webp"
        bottomImageAlt="회원 정보 토끼"
        bottomImageFallback="/images/myPage/bunny-info.png"
      >
        <FadeWrapper changeKey="info">
          <h1 className="text-xl font-bold mb-4">추가 정보</h1>
          <p>우측 사이드에 보여줄 내용</p>
        </FadeWrapper>
      </RightAside>
    </>
  );
}
