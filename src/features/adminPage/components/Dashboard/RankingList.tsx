import { RankingItem } from './types';

interface RankingListProps {
  title: string;
  subtitle: string;
  data: RankingItem[];
  width?: number;
  height?: number;
}

const RankingList = ({ title, subtitle, data, width = 546, height = 345 }: RankingListProps) => {
  return (
    <div
      className="bg-white p-6 rounded-[18px] shadow-sm border border-gray-100"
      style={{ width, height }}
    >
      <h3 className="text-title-4 mb-4">
        {title}
        <span className="text-body-1 text-grey04 ml-3">{subtitle}</span>
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className="text-body-1 text-title-6 text-grey05 w-4 mr-[37px]">
                {index + 1}
              </span>
              <span className="text-body-1">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-body-1 w-4 text-center ${
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
                className={`text-body-1 w-8 text-right ${
                  item.trend === 'up'
                    ? 'text-orange04'
                    : item.trend === 'down'
                      ? 'text-grey03'
                      : 'text-grey03'
                }`}
              >
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingList;
