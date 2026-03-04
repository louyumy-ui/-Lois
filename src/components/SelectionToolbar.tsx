import React from 'react';
import { Sparkles, Trash2, CheckCircle } from 'lucide-react';

interface SelectionToolbarProps {
  selectedCount: number;
  totalCount: number;
  autoMode: boolean;
  onAutoModeChange: (auto: boolean) => void;
  onAutoSelect: () => void;
  onClearSelection: () => void;
  recommendCount: number;
  onRecommendCountChange: (count: number) => void;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  selectedCount,
  totalCount,
  autoMode,
  onAutoModeChange,
  onAutoSelect,
  onClearSelection,
  recommendCount,
  onRecommendCountChange,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-blue-50 p-3 rounded-sm border border-blue-100">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-2 py-1 bg-white rounded-sm border border-blue-200 shadow-sm">
          <span className="text-xs font-medium text-ant-blue">已选: {selectedCount}</span>
          <span className="text-[10px] text-blue-300">/ {totalCount}</span>
        </div>

        <div className="h-6 w-px bg-blue-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-800 font-medium">选号模式:</span>
          <div className="flex p-0.5 bg-blue-100 rounded-sm">
            <button
              onClick={() => onAutoModeChange(true)}
              className={`px-2 py-0.5 text-[10px] rounded-sm transition-all ${
                autoMode ? 'bg-white text-ant-blue shadow-sm' : 'text-blue-500 hover:text-blue-700'
              }`}
            >
              自动低频
            </button>
            <button
              onClick={() => onAutoModeChange(false)}
              className={`px-2 py-0.5 text-[10px] rounded-sm transition-all ${
                !autoMode ? 'bg-white text-ant-blue shadow-sm' : 'text-blue-500 hover:text-blue-700'
              }`}
            >
              手动勾选
            </button>
          </div>
        </div>

        {autoMode && (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs text-blue-800 font-medium">推荐数量:</span>
            <input
              type="number"
              min={1}
              max={totalCount}
              value={recommendCount}
              onChange={(e) => onRecommendCountChange(parseInt(e.target.value) || 1)}
              className="w-12 px-1 py-0.5 text-xs border border-blue-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-ant-blue"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {autoMode && (
          <button
            onClick={onAutoSelect}
            className="flex items-center gap-2 px-3 py-1.5 bg-ant-blue text-white rounded-sm hover:bg-ant-blue-hover transition-colors shadow-sm text-xs font-medium"
          >
            <Sparkles size={14} />
            智能推荐 (低频优先)
          </button>
        )}
        
        {selectedCount > 0 && (
          <button
            onClick={onClearSelection}
            className="flex items-center gap-2 px-3 py-1.5 bg-white text-red-500 border border-red-100 rounded-sm hover:bg-red-50 transition-colors text-xs font-medium"
          >
            <Trash2 size={14} />
            清除选择
          </button>
        )}

        {selectedCount > 0 && (
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-ant-blue rounded-sm hover:bg-blue-200 transition-colors text-xs font-medium border border-blue-200"
          >
            <CheckCircle size={14} />
            确认分配
          </button>
        )}
      </div>
    </div>
  );
};

export default SelectionToolbar;
