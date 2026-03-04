import React from 'react';
import { Filters } from '../types';
import { CARRIERS, PROVINCES } from '../data/mockNumbers';
import { Search, Filter } from 'lucide-react';

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange }) => {
  const selectedProvince = PROVINCES.find(p => p.name === filters.province);

  return (
    <div className="bg-white p-4 rounded-sm border border-gray-200 space-y-4">
      <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
        <Filter size={16} className="text-ant-blue" />
        <span>筛选线路</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <select
          className="ant-input w-full bg-white"
          value={filters.carrier}
          onChange={(e) => onChange({ ...filters, carrier: e.target.value })}
        >
          <option value="all">所有运营商</option>
          {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="ant-input w-full bg-white"
          value={filters.province}
          onChange={(e) => onChange({ ...filters, province: e.target.value, city: 'all' })}
        >
          <option value="all">所有省份</option>
          {PROVINCES.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
        </select>

        <select
          className="ant-input w-full bg-white"
          value={filters.city}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
          disabled={filters.province === 'all'}
        >
          <option value="all">所有地市</option>
          {selectedProvince?.cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="ant-input w-full bg-white"
          value={filters.accountStatus}
          onChange={(e) => onChange({ ...filters, accountStatus: e.target.value as any })}
        >
          <option value="all">账号状态: 全部</option>
          <option value="active">活跃</option>
          <option value="suspended">已停用</option>
        </select>

        <select
          className="ant-input w-full bg-white"
          value={filters.cooldownStatus}
          onChange={(e) => onChange({ ...filters, cooldownStatus: e.target.value as any })}
        >
          <option value="all">冷却状态: 全部</option>
          <option value="yes">冷却中</option>
          <option value="no">非冷却</option>
        </select>

        <select
          className="ant-input w-full bg-white"
          value={filters.displayStatus}
          onChange={(e) => onChange({ ...filters, displayStatus: e.target.value as any })}
        >
          <option value="all">外显状态: 全部</option>
          <option value="yes">已开启</option>
          <option value="no">已关闭</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
