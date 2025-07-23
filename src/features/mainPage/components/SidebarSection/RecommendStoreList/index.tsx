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
    const base = 'ml-2 px-6 py-1 rounded-full text-body-3 font-bold text-white shimmer-gradient';
    switch (rank) {
      case 1:
        return `${base} badge-gold`;
      case 2:
        return `${base} badge-silver`;
      case 3:
        return `${base} badge-bronze`;
      default:
        return 'ml-2 px-6 py-1 rounded-full text-body-3 bg-grey02 text-grey05';
    }
  };

  return (
    <>
      <style>{`
        /* 공통 shimmer */
        .shimmer-gradient {
          background-size: 300% 300%;
          background-repeat: no-repeat;
          background-position: 0% 0%;
          animation: moveGradient 8s linear infinite;
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
    #f7e27c 0%,
    #ffe97a 25%,
    #fff8c3 50%,
    #ffdf59 75%,
    #ddb945 100%
  );
}

        /* 은색 */
        .badge-silver {
          background-image: linear-gradient(
            135deg,
            #7a96ac 0%,
            #eaeff3 18%,
            #c2d4e1 31%,
            #ffffff 49%,
            #d4dee5 62%,
            #abbdc8 79%,
            #bccad7 95%
          );
        }

        /* 동색 (브론즈) */
        .badge-bronze {
  background-image: linear-gradient(
    135deg,
    #c97b48 0%,
    #e5a477 25%,
    #f5c6a0 50%,
    #d58b5e 75%,
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
