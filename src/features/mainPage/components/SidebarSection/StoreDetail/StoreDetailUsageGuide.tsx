import React from 'react';
import { BenefitDetailResponse } from '../../../types/api';

interface StoreDetailUsageGuideProps {
  detailData: BenefitDetailResponse | null;
}

const StoreDetailUsageGuide: React.FC<StoreDetailUsageGuideProps> = ({ detailData }) => {
  if (!detailData?.data.manual) return null;

  return (
    <div className="mb-6">
      <h3 className="text-title-6 text-grey06 mb-3">이용 방법</h3>
      <ul className="space-y-2 text-body-3 text-grey05">
        {detailData.data.manual
          .split('\n')
          .filter((line) => line.trim() !== '')
          .map((line, idx) => (
            <li key={idx}>
              <span>{line.trim()}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default StoreDetailUsageGuide;
