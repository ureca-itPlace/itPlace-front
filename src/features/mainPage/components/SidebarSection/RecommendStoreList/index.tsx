import React from 'react';

interface RecommendStore {
  benefitId: number;
  partnerName: string;
  partnerImage?: string;
  rank: number;
}

interface RecommendStoreListProps {
  stores: RecommendStore[];
  onItemClick: (store: RecommendStore) => void;
  isLoading?: boolean;
}

const RecommendStoreList: React.FC<RecommendStoreListProps> = ({
  stores,
  onItemClick,
  isLoading = false,
}) => {
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
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="h-[60px] bg-grey02 rounded-[10px] animate-pulse" />
            ))
          : stores.map((store) => (
              <div
                key={store.benefitId}
                onClick={() => onItemClick(store)}
                className="w-[330px] h-[60px] bg-grey01 rounded-[10px] px-4 flex items-center cursor-pointer hover:bg-purple01 transition-colors overflow-x-hidden"
              >
                {/* 왼쪽 이미지 */}
                <div className="w-[50px] h-[50px] rounded-[10px] overflow-hidden flex-shrink-0 mr-6">
                  {store.partnerImage ? (
                    <img
                      src={store.partnerImage}
                      alt={`${store.partnerName} 로고`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple04 flex items-center justify-center">
                      <span className="text-white text-body-4 font-bold">
                        {store.partnerName.charAt(0)}
                      </span>
                    </div>
                  )}
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
            ))}
      </div>
    </>
  );
};

export default RecommendStoreList;
