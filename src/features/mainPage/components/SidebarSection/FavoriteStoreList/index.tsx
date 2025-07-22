import React from 'react';

interface Store {
  id: string;
  name: string;
  category: string;
}

interface FavoriteStoreListProps {
  stores: Store[];
  onStoreClick: (store: Store) => void;
}

const FavoriteStoreList: React.FC<FavoriteStoreListProps> = ({ stores, onStoreClick }) => {
  return (
    <div className="space-y-3">
      {stores.map((store) => (
        <div
          key={store.id}
          onClick={() => onStoreClick(store)}
          className="p-4 border border-grey02 rounded-lg cursor-pointer hover:bg-grey01 transition-colors"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-title-7 font-bold text-grey06">{store.name}</h3>
              <p className="text-body-5 text-grey04">{store.category}</p>
            </div>
            <div className="w-8 h-8 bg-purple04 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{store.name.charAt(0)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoriteStoreList;
