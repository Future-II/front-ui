import React from 'react';
import { Asset } from '../../types';

interface AssetListProps {
    assets: Asset[];
}

type FilterType = 'all' | 'complete' | 'incomplete';

const AssetList: React.FC<AssetListProps> = ({ assets }) => {
    const [activeFilter, setActiveFilter] = React.useState<FilterType>('all');

    const filteredAssets = assets.filter(asset => {
        switch (activeFilter) {
            case 'complete':
                return asset.submitState === 1;
            case 'incomplete':
                return asset.submitState !== 1;
            case 'all':
            default:
                return true;
        }
    });

    return (
        <div className="px-4 pb-4 space-y-3">
            {/* Filter Buttons */}
            <div className="flex gap-2 mb-2">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1 text-xs rounded-full border transition ${
                        activeFilter === 'all'
                            ? 'bg-gray-100 text-gray-700 border-gray-300 font-medium'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setActiveFilter('complete')}
                    className={`px-3 py-1 text-xs rounded-full border transition ${
                        activeFilter === 'complete'
                            ? 'bg-green-100 text-green-700 border-green-300 font-medium'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-green-50'
                    }`}
                >
                    Complete
                </button>
                <button
                    onClick={() => setActiveFilter('incomplete')}
                    className={`px-3 py-1 text-xs rounded-full border transition ${
                        activeFilter === 'incomplete'
                            ? 'bg-red-100 text-red-700 border-red-300 font-medium'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-red-50'
                    }`}
                >
                    Incomplete
                </button>
            </div>

            {filteredAssets.map(asset => (
                <div key={asset.id} className="flex justify-between items-center rounded-lg p-3 border border-gray-100 bg-gray-50 transition">
                    <div className="flex-1">
                        <p className="font-medium text-gray-800">{asset.asset_name}</p>
                        <p className="text-sm text-gray-500">
                            {asset.final_value} • {asset.owner_name}
                        </p>
                        {asset.id && (
                            <p className="text-xs text-gray-400 mt-1">
                                ID: {asset.id}
                            </p>
                        )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${asset.submitState === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}>
                        {asset.submitState === 1 ? "Complete" : "Incomplete"}
                    </span>
                </div>
            ))}
            
            {filteredAssets.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                    No assets match the current filter
                </div>
            )}
        </div>
    );
};

export default AssetList;