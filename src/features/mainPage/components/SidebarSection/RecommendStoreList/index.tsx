import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import { RecommendationItem } from '../../../types/api';
import NoResult from '../../../../../components/NoResult';
import LoadingSpinner from '../../../../../components/LoadingSpinner';

interface RecommendStoreListProps {
  stores: RecommendationItem[];
  onItemClick: (store: RecommendationItem) => void;
  isLoading?: boolean;
  error?: string | null;
}

const RecommendStoreList: React.FC<RecommendStoreListProps> = ({
  stores,
  onItemClick,
  isLoading = false,
  error = null,
}) => {
  const isLoggedIn = useSelector((state: RootState) => !!state.auth.user);
  // 에러 메시지에 따른 요약 생성
  const getErrorSummary = (errorMessage: string) => {
    if (
      errorMessage.includes('멤버십 회원이 아닙니다') ||
      errorMessage.includes('RECOMMENDATION_USER_NOT_MEMBERSHIP')
    ) {
      return '유플러스 멤버십 회원만 이용 가능해요!';
    }
    if (
      errorMessage.includes('사용자를 찾을 수 없습니다') ||
      errorMessage.includes('SECURITYCODE_USER_NOT_FOUND')
    ) {
      return '사용자 정보를 찾을 수 없어요!';
    }
    if (
      errorMessage.includes('추천 결과 생성 실패') ||
      errorMessage.includes('RECOMMENDATION_RESULT_FAIL')
    ) {
      return 'AI 추천 생성에 실패했어요!';
    }
    if (errorMessage.includes('INTERNAL_SERVER_ERROR')) {
      return '서버에 문제가 발생했어요!';
    }
    // 기본 에러 메시지
    return 'AI 추천을 불러올 수 없어요!';
  };

  const getBadgeClass = (rank: number) => {
    const base = 'ml-2 px-6 py-1 rounded-full text-body-4 text-black shimmer-gradient';
    switch (rank) {
      case 1:
        return `${base} badge-gold`;
      case 2:
        return `${base} badge-silver`;
      case 3:
        return `${base} badge-bronze`;
      default:
        return 'ml-2 px-6 py-1 rounded-full text-body-4 bg-grey02 text-grey05';
    }
  };

  return (
    <>
      <style>{`
        /* 공통 shimmer */
        .shimmer-gradient {
          background-size: 200% 200%;
          background-repeat: repeat;
          animation: moveGradient 3s linear infinite;
        }

        @keyframes moveGradient {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }

        /* 금색 */
        .badge-gold {
          background-image: linear-gradient(
            135deg,
            #ffe97a 0%,
            #fff8c3 10%,
            #f0d060 20%,
            #ddb945 25%,
            #f0d060 30%,
            #fff8c3 40%,
            #ffe97a 50%,
            #fff8c3 60%,
            #f0d060 70%,
            #ddb945 75%,
            #f0d060 80%,
            #fff8c3 90%,
            #ffe97a 100%
          );
        }

        /* 은색 */
        .badge-silver {
          background-image: linear-gradient(
            135deg,
            #ffffff 0%,
            #e0eaf0 10%,
            #a8bcc9 20%,
            #7a96ac 25%,
            #a8bcc9 30%,
            #e0eaf0 40%,
            #ffffff 50%,
            #e0eaf0 60%,
            #a8bcc9 70%,
            #7a96ac 75%,
            #a8bcc9 80%,
            #e0eaf0 90%,
            #ffffff 100%
          );
        }

        /* 동색 (브론즈) */
        .badge-bronze {
          background-image: linear-gradient(
            135deg,
            #a7623d 0%,
            #c17a47 10%,
            #eab088 20%,
            #f5c6a0 25%,
            #eab088 30%,
            #c17a47 40%,
            #a7623d 50%,
            #c17a47 60%,
            #eab088 70%,
            #f5c6a0 75%,
            #eab088 80%,
            #c17a47 90%,
            #a7623d 100%
          );
        }
      `}</style>

      <div className="space-y-3 px-5">
        {!isLoggedIn ? (
          <div className="flex items-center justify-center">
            <NoResult
              message1="로그인이 필요합니다!"
              message2="AI 추천을 받으려면 로그인해 주세요"
              message1FontSize="text-title-6"
              message2FontSize="text-body-3"
              isLoginRequired={true}
              buttonText="로그인하러 가기"
              buttonRoute="/login"
            />
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center">
            <NoResult message1={error} message2={getErrorSummary(error)} isLoginRequired={false} />
          </div>
        ) : !stores || stores.length === 0 ? (
          <div className="flex items-center justify-center">
            <NoResult
              message1="추천 결과가 없어요!"
              message2="ItPlace 이용 정보가 부족해요"
              message1FontSize="text-title-6"
              message2FontSize="text-body-3"
              isLoginRequired={false}
            />
          </div>
        ) : (
          stores.map((store) => (
            <div
              key={`${store.partnerName}-${store.rank}`}
              onClick={() => onItemClick(store)}
              className="w-[330px] h-[60px] bg-grey01 rounded-[10px] px-4 flex items-center cursor-pointer hover:bg-purple01 transition-colors overflow-x-hidden"
            >
              {/* 왼쪽 이미지 */}
              <div className="w-[50px] h-[50px] bg-white rounded-[10px] overflow-hidden flex-shrink-0 mr-6">
                <img
                  src={store.imgUrl || '/mainPage/RecommendDefault.png'}
                  alt={`${store.partnerName} 로고`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* 중앙: 이름 */}
              <div className="flex-1">
                <span className="text-body-3-bold text-grey06">{store.partnerName}</span>
              </div>

              {/* 오른쪽: 뱃지 */}
              <div className={getBadgeClass(store.rank)}>
                <span>{store.rank}위</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default RecommendStoreList;
