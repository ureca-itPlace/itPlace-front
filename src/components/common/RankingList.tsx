import { RankingItem } from '../../features/adminPage/types/types';

interface RankingListProps {
  title: string;
  subtitle: string;
  data: RankingItem[];
  width?: number;
  height?: number;
  backgroundColor?: string;
}

const RankingList = ({
  title,
  subtitle,
  data,
  width = 546,
  height = 345,
  backgroundColor = 'bg-white',
}: RankingListProps) => {
  return (
    <div className={`${backgroundColor} p-6 rounded-[18px]`} style={{ width, height }}>
      <h3 className="text-title-4  mb-4">
        {title}
        <span className="text-body-1  text-grey04 ml-3">{subtitle}</span>
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 transform transition-all duration-300 hover:scale-105 hover:bg-grey01 rounded-lg px-2"
            style={{
              animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-body-1 text-title-6 text-grey05 w-4 mr-[37px]">
                {index + 1}
              </span>
              <span className="text-body-1">{item.partnerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-body-2  w-4 text-center transition-all duration-200 ${
                  item.trend === 'up'
                    ? 'text-orange04'
                    : item.trend === 'down'
                      ? 'text-grey03'
                      : 'text-grey03'
                }`}
              >
                {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '-'}
              </span>
              <span
                className={`text-body-2  w-8 text-right  transition-all duration-200 ${
                  item.trend === 'up'
                    ? 'text-orange04'
                    : item.trend === 'down'
                      ? 'text-grey03'
                      : 'text-grey03'
                }`}
              >
                {item.rankChange ? Math.abs(item.rankChange) : '-'}
              </span>
            </div>
          </div>
        ))}
      </div>
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default RankingList;
export type { RankingListProps };
