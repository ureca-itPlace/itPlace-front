import React from 'react';
import { TbChevronRight } from 'react-icons/tb';

interface Store {
  id: string;
  name: string;
  logo?: string;
  category?: string;
}

interface FavoriteStoreListProps {
  stores: Store[];
  onStoreClick?: (store: Store) => void;
}

const FavoriteStoreList: React.FC<FavoriteStoreListProps> = ({ stores, onStoreClick }) => {
  return (
    <div className="space-y-3">
      {stores.map((store) => (
        <div
          key={store.id}
          onClick={() => onStoreClick?.(store)}
          className="flex items-center justify-between p-3 bg-white border border-grey02 rounded-lg cursor-pointer hover:bg-grey01 transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            {store.logo && (
              <div className="w-10 h-10 bg-grey01 rounded-lg flex items-center justify-center">
                <img src={store.logo} alt={store.name} className="w-8 h-8 object-contain" />
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-grey06">{store.name}</div>
              {store.category && <div className="text-xs text-grey04 mt-1">{store.category}</div>}
            </div>
          </div>
          <TbChevronRight size={16} className="text-grey04" />
        </div>
      ))}
    </div>
  );
};

export default FavoriteStoreList;
