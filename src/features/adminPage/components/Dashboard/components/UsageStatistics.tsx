import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { UsageDataItem, LegendItem } from '../../../types/types';

interface UsageStatisticsProps {
  title: string;
  subtitle: string;
  data: UsageDataItem[];
  legends: LegendItem[];
  width?: number;
  height?: number;
}

const CustomTick = (props: { x: number; y: number; payload: { value: string } }) => {
  const { x, y, payload } = props;
  return (
    <text x={x} y={y} dy={20} textAnchor="middle" className="text-black text-body-1">
      {payload.value}
    </text>
  );
};

const UsageStatistics = ({
  title,
  subtitle,
  data,
  legends,
  width = 836,
  height = 382,
}: UsageStatisticsProps) => {
  return (
    <div className="bg-white p-6 rounded-[18px]" style={{ width, height }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-title-4 ">
          {title}
          <span className="text-body-1  text-grey04 ml-3">{subtitle}</span>
        </h3>
        <div className="flex items-center mr-[40px] text-body-1">
          {legends.map((legend, index) => (
            <div key={legend.key} className={`flex items-center ${index > 0 ? 'ml-[24px]' : ''}`}>
              <div className={`w-3 h-3  ${legend.color}`}></div>
              <span className="text-body-1 text-grey04 ml-[12px]">{legend.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-64 mt-[43px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -10, bottom: 5 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="partnerName" tick={CustomTick} />
            <YAxis />
            <Bar dataKey="vvipUsageCount" fill="#7638FA" radius={[10, 10, 0, 0]} />
            <Bar dataKey="vipUsageCount" fill="#A175FF" radius={[10, 10, 0, 0]} />
            <Bar dataKey="basicUsageCount" fill="#CDB5FF" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsageStatistics;
