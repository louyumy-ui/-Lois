import React from 'react';
import { PhoneNumber } from '../types';
import { Check, MoreHorizontal, ExternalLink } from 'lucide-react';

interface NumberTableProps {
  numbers: PhoneNumber[];
  onToggle?: (id: string) => void;
  onToggleAll?: (checked: boolean) => void;
  onUpdateNumber?: (id: string, updates: Partial<PhoneNumber>) => void;
  onEdit?: (number: PhoneNumber) => void;
  allSelected?: boolean;
  isSelectable?: boolean;
}

const NumberTable: React.FC<NumberTableProps> = ({
  numbers,
  onToggle,
  onToggleAll,
  onUpdateNumber,
  onEdit,
  allSelected = false,
  isSelectable = true,
}) => {
  const Switch = ({ checked, onChange, label, activeColor = 'bg-ant-blue' }: { checked: boolean, onChange: () => void, label?: string, activeColor?: string }) => (
    <div className="flex items-center gap-2">
      <div 
        onClick={onChange}
        className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors duration-200 ${
          checked ? activeColor : 'bg-gray-300'
        }`}
      >
        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`} />
      </div>
      {label && <span className="text-xs text-gray-600">{label}</span>}
    </div>
  );

  return (
    <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fafafa] border-b border-gray-200">
              {isSelectable && (
                <th className="p-3 w-12">
                  <div 
                    onClick={() => onToggleAll?.(!allSelected)}
                    className={`w-4 h-4 rounded-sm border flex items-center justify-center cursor-pointer transition-all ${
                      allSelected ? 'bg-ant-blue border-ant-blue text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    {allSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </th>
              )}
              <th className="p-3 text-xs font-semibold text-gray-800 uppercase tracking-wider">呼叫号码</th>
              <th className="p-3 text-xs font-semibold text-gray-800 uppercase tracking-wider">运营商</th>
              <th className="p-3 text-xs font-semibold text-gray-800 uppercase tracking-wider">省份</th>
              <th className="p-3 text-xs font-semibold text-gray-800 uppercase tracking-wider">城市</th>
              <th className="p-3 text-xs font-semibold text-gray-800 uppercase tracking-wider">外显状态</th>
              <th className="p-3 text-xs font-semibold text-gray-800 uppercase tracking-wider">关联坐席</th>
              <th className="p-3 text-xs font-semibold text-gray-800 uppercase tracking-wider">累计使用</th>
              <th className="p-3 text-xs font-semibold text-gray-800 uppercase tracking-wider">账号状态</th>
              <th className="p-3 text-xs font-semibold text-gray-800 uppercase tracking-wider">备注</th>
              <th className="p-3 text-xs font-semibold text-gray-800 uppercase tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {numbers.length === 0 ? (
              <tr>
                <td colSpan={isSelectable ? 11 : 10} className="p-12 text-center text-gray-400">
                  暂无数据
                </td>
              </tr>
            ) : (
              numbers.map((n) => (
                <tr 
                  key={n.id} 
                  className={`group hover:bg-blue-50/30 transition-colors ${n.selected ? 'bg-blue-50/50' : ''}`}
                >
                  {isSelectable && (
                    <td className="p-3">
                      <div 
                        onClick={() => onToggle?.(n.id)}
                        className={`w-4 h-4 rounded-sm border flex items-center justify-center cursor-pointer transition-all ${
                          n.selected ? 'bg-ant-blue border-ant-blue text-white' : 'bg-white border-gray-300 group-hover:border-ant-blue'
                        }`}
                      >
                        {n.selected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </td>
                  )}
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-mono text-sm text-gray-900">{n.number}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-sm text-xs font-medium ${
                      n.carrier === '中国移动' ? 'bg-blue-50 text-blue-600' :
                      n.carrier === '中国联通' ? 'bg-red-50 text-red-600' :
                      n.carrier === '中国电信' ? 'bg-indigo-50 text-indigo-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {n.carrier}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{n.province}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{n.city}</span>
                  </td>
                  <td className="p-3">
                    <Switch 
                      checked={n.isDisplay} 
                      onChange={() => onUpdateNumber?.(n.id, { isDisplay: !n.isDisplay })}
                      label={n.isDisplay ? '已开启' : '已关闭'}
                    />
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">
                      {n.assignedAgentId ? `坐席-${n.assignedAgentId.split('-')[1]}` : '--'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[60px]">
                        <div 
                          className={`h-full ${n.usageCount > 300 ? 'bg-amber-400' : 'bg-ant-blue'}`} 
                          style={{ width: `${Math.min(100, (n.usageCount / 500) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-gray-500">{n.usageCount}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <Switch 
                      checked={n.status === 'active'} 
                      onChange={() => onUpdateNumber?.(n.id, { status: n.status === 'active' ? 'suspended' : 'active' })}
                      label={n.status === 'active' ? '活跃' : n.status === 'cooldown' ? '冷却中' : '已停用'}
                      activeColor="bg-emerald-500"
                    />
                  </td>
                  <td className="p-3">
                    <span className="text-xs text-gray-400 truncate max-w-[100px] block" title={n.remark}>
                      {n.remark || '--'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onEdit?.(n)}
                        className="text-ant-blue hover:text-ant-blue-hover text-xs"
                      >
                        编辑
                      </button>
                      <button className="text-red-500 hover:text-red-600 text-xs">删除</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>共 {numbers.length} 条</span>
          <select className="ant-input bg-white py-0.5 h-6">
            <option>10条/页</option>
            <option>20条/页</option>
            <option>50条/页</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-sm text-gray-400 hover:border-ant-blue hover:text-ant-blue transition-colors">
            &lt;
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-ant-blue bg-ant-blue text-white rounded-sm text-xs">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-sm text-gray-600 hover:border-ant-blue hover:text-ant-blue transition-colors">
            &gt;
          </button>
          <span className="text-xs text-gray-500 ml-2">前往</span>
          <input type="text" defaultValue="1" className="ant-input w-10 py-0 h-6 text-center" />
          <span className="text-xs text-gray-500">页</span>
        </div>
      </div>
    </div>
  );
};

export default NumberTable;
