import React, { useState, useMemo, useCallback } from 'react';
import { FileText, Plus, Play, MoreVertical, Clock, Search, X } from 'lucide-react';
import { PhoneNumber, Filters } from '../types';
import FilterPanel from './FilterPanel';
import SelectionToolbar from './SelectionToolbar';
import NumberTable from './NumberTable';

interface CallScriptsProps {
  allNumbers: PhoneNumber[];
  onNumbersChange: (numbers: PhoneNumber[]) => void;
}

const CallScripts: React.FC<CallScriptsProps> = ({ allNumbers, onNumbersChange }) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [activeScript, setActiveScript] = useState<any>(null);
  const [autoMode, setAutoMode] = useState(true);
  const [recommendCount, setRecommendCount] = useState(5);
  const [filters, setFilters] = useState<Filters>({
    carrier: 'all',
    province: 'all',
    city: 'all',
    search: '',
    frequency: 'all',
    displayStatus: 'all',
  });

  const scripts = useMemo(() => [
    { id: 1, name: '金融分期回访话术', type: '回访', status: '已发布', time: '2024-03-01' },
    { id: 2, name: '电商大促通知话术', type: '通知', status: '草稿', time: '2024-02-28' },
    { id: 3, name: '保险到期提醒', type: '提醒', status: '已发布', time: '2024-02-25' },
    { id: 4, name: '新客户回访调研', type: '调研', status: '已发布', time: '2024-02-20' },
  ].map(s => ({
    ...s,
    numbers: allNumbers.filter(n => n.assignedScriptId === s.id).length
  })), [allNumbers]);

  const filtered = useMemo(() => {
    return allNumbers
      .filter((n) => {
        // Exclude exclusive numbers unless they are already assigned to this script
        if (n.isExclusive && n.assignedScriptId !== activeScript?.id) return false;

        if (filters.carrier !== 'all' && n.carrier !== filters.carrier) return false;
        if (filters.province !== 'all' && n.province !== filters.province) return false;
        if (filters.city !== 'all' && n.city !== filters.city) return false;
        if (filters.search && !n.number.includes(filters.search)) return false;
        
        if (filters.frequency === 'low' && n.usageCount > 300) return false;
        if (filters.frequency === 'high' && n.usageCount <= 300) return false;
        
        if (filters.displayStatus === 'yes' && !n.isDisplay) return false;
        if (filters.displayStatus === 'no' && n.isDisplay) return false;
        
        return true;
      })
      .sort((a, b) => {
        // 1. Prioritize numbers already assigned to this script (permanent assignment)
        const aAssigned = a.assignedScriptId === activeScript?.id ? 1 : 0;
        const bAssigned = b.assignedScriptId === activeScript?.id ? 1 : 0;
        if (aAssigned !== bAssigned) return bAssigned - aAssigned;

        // 2. Prioritize numbers currently selected in the modal (temporary selection)
        const aSelected = a.selected ? 1 : 0;
        const bSelected = b.selected ? 1 : 0;
        if (aSelected !== bSelected) return bSelected - aSelected;

        return 0;
      });
  }, [allNumbers, filters, activeScript]);

  const toggleNumber = useCallback((id: string) => {
    onNumbersChange(allNumbers.map((n) => (n.id === id ? { ...n, selected: !n.selected } : n)));
  }, [allNumbers, onNumbersChange]);

  const toggleAll = useCallback((checked: boolean) => {
    const filteredIds = new Set(filtered.map((n) => n.id));
    onNumbersChange(allNumbers.map((n) => (filteredIds.has(n.id) ? { ...n, selected: checked } : n)));
  }, [allNumbers, filtered, onNumbersChange]);

  const autoSelect = useCallback(() => {
    const sorted = [...filtered]
      .filter((n) => n.status === 'active' && !n.isExclusive) // Exclude exclusive from auto-select
      .sort((a, b) => {
        if (a.usageCount !== b.usageCount) return a.usageCount - b.usageCount;
        return b.successRate - a.successRate;
      });
    const topIds = new Set(sorted.slice(0, recommendCount).map((n) => n.id));
    onNumbersChange(allNumbers.map((n) => ({ ...n, selected: topIds.has(n.id) })));
  }, [filtered, allNumbers, onNumbersChange, recommendCount]);

  const clearSelection = useCallback(() => {
    onNumbersChange(allNumbers.map((n) => ({ ...n, selected: false })));
  }, [allNumbers, onNumbersChange]);

  const selectedCount = allNumbers.filter((n) => n.selected).length;
  const allFilteredSelected = filtered.length > 0 && filtered.every((n) => n.selected);

  const handleOpenAssign = (script: any) => {
    setActiveScript(script);
    setIsAssigning(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">外呼话术</h1>
          <p className="text-xs text-gray-500 mt-1">管理AI外呼话术流程，配置对应的外呼线路号码。</p>
        </div>
        <button className="ant-btn-primary flex items-center gap-2">
          <Plus size={16} />
          <span>新建话术</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-sm border border-gray-200 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input 
            type="text" 
            placeholder="搜索话术名称..." 
            className="ant-input w-full pl-9"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">所有分类</button>
          <button className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">最近修改</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scripts.map((script) => (
          <div key={script.id} className="bg-white p-5 rounded-sm border border-gray-200 hover:border-ant-blue transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-ant-blue rounded flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-ant-blue transition-colors text-sm">{script.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-sm">{script.type}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${
                      script.status === '已发布' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>{script.status}</span>
                  </div>
                </div>
              </div>
              <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded">
                <MoreVertical size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50 mb-4">
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-gray-400" />
                <span className="text-[10px] text-gray-500">{script.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Play size={12} className="text-gray-400" />
                <span className="text-[10px] text-gray-500">已关联 {script.numbers} 个号码</span>
              </div>
            </div>

            {script.numbers > 0 && (
              <div className="mb-4">
                <p className="text-[10px] text-gray-400 mb-2">已分配号码预览:</p>
                <div className="flex flex-wrap gap-1">
                  {allNumbers.filter(n => n.assignedScriptId === script.id).slice(0, 3).map(n => (
                    <span key={n.id} className="px-1.5 py-0.5 bg-blue-50 text-ant-blue text-[10px] rounded-sm border border-blue-100">
                      {n.number}
                    </span>
                  ))}
                  {script.numbers > 3 && <span className="text-[10px] text-gray-400 self-center">...</span>}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button className="flex-1 py-1.5 text-xs font-medium text-ant-blue bg-blue-50 hover:bg-blue-100 rounded-sm transition-all border border-blue-100">
                编辑流程
              </button>
              <button 
                onClick={() => handleOpenAssign(script)}
                className="flex-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-sm transition-all border border-gray-200"
              >
                分配号码
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Modal */}
      {isAssigning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-sm shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="border-l-4 border-ant-blue pl-3">
                <h2 className="text-lg font-bold text-gray-800">分配号码 - {activeScript?.name}</h2>
                <p className="text-xs text-gray-500">选择低频、无外显的号码以提高外呼成功率并降低封号风险。</p>
              </div>
              <button 
                onClick={() => setIsAssigning(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f0f2f5]">
              <FilterPanel filters={filters} onChange={setFilters} />
              
              <SelectionToolbar
                selectedCount={selectedCount}
                totalCount={filtered.length}
                autoMode={autoMode}
                onAutoModeChange={setAutoMode}
                onAutoSelect={autoSelect}
                onClearSelection={clearSelection}
                recommendCount={recommendCount}
                onRecommendCountChange={setRecommendCount}
              />
              
              <NumberTable
                numbers={filtered}
                onToggle={toggleNumber}
                onToggleAll={toggleAll}
                allSelected={allFilteredSelected}
                isSelectable={true}
              />
            </div>

            <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-white">
              <span className="text-xs text-gray-500">
                当前已选择 <span className="font-bold text-ant-blue">{selectedCount}</span> 个号码
              </span>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsAssigning(false)}
                  className="px-4 py-1.5 border border-gray-300 rounded-sm text-sm hover:bg-gray-50 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    alert(`成功为 [${activeScript?.name}] 分配 ${selectedCount} 个号码`);
                    setIsAssigning(false);
                  }}
                  className="ant-btn-primary"
                >
                  确认分配
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallScripts;

