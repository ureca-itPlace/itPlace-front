import { WishlistItem } from '../../../types/types';

interface WishlistChartProps {
  title: string;
  subtitle: string;
  data: WishlistItem[];
  width?: number;
  height?: number;
}

const WishlistChart = ({
  title,
  subtitle,
  data,
  width = 836,
  height = 345,
}: WishlistChartProps) => {
  const maxValue = Math.max(...data.map((d) => d.favoriteCount));

  return (
    <div className="bg-white p-6 rounded-[18px]" style={{ width, height }}>
      {/* 5개로 할 거면 mb-[30px], space-y-[24px]로 */}
      <h3 className="text-title-4 mb-[30px]">
        {title}
        <span className="text-body-1  text-grey04 ml-3">{subtitle}</span>
      </h3>
      <div className="space-y-[24px]">
        {data.map((item, index) => {
          const barWidth = (item.favoriteCount / maxValue) * 100;

          return (
            <div key={index} className="flex items-center">
              <span className="text-body-1 w-28 flex-shrink-0 truncate">{item.partnerName}</span>
              <div className="flex-1 mx-6">
                <div className="relative h-6 bg-grey01 rounded-full">
                  <div
                    className="h-full rounded-full animate-grow-width"
                    style={{
                      backgroundColor: item.color,
                      width: `${barWidth}%`,
                      animationDelay: `${index * 0.1}s`,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      animation: `growWidth 1s ease-out ${index * 0.1}s forwards`,
                    }}
                  ></div>
                </div>
              </div>
              <span className="text-body-2 text-black w-24 text-right flex-shrink-0">
                ({item.favoriteCount}회)
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes growWidth {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};

export default WishlistChart;
