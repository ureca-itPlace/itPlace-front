import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ClickDataItem } from '../../../types/types';

interface ClickStatisticsProps {
  title: string;
  subtitle: string;
  data: ClickDataItem[];
  width?: number;
  height?: number;
}

// Recharts PieLabelProps 직접 정의 (일부 속성만 사용)
type CustomPieLabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  value?: number;
};

const renderCustomizedLabel = (props: CustomPieLabelProps) => {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, value } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-body-4"
    >
      {typeof value === 'number' ? `${value.toLocaleString()}회` : ''}
    </text>
  );
};

const ClickStatistics = ({
  title,
  subtitle,
  data,
  width = 546,
  height = 382,
}: ClickStatisticsProps) => {
  return (
    <div className="bg-white p-6 rounded-[18px]" style={{ width, height }}>
      <h3 className="text-title-4  mb-4">
        {title}
        <span className="text-body-1  text-grey04 block mt-[12px]">{subtitle}</span>
      </h3>
      <div className="flex items-center">
        <div className="w-64 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={100}
                paddingAngle={5}
                dataKey="clickCount"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 ml-8">
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-4 h-4" style={{ backgroundColor: item.color }}></div>
                <div className="flex-1">
                  <div className="text-body-1 text-grey04">{item.partnerName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClickStatistics;
