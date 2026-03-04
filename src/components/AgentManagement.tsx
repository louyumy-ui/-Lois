import React, { useState, useMemo } from 'react';
import { Users, Search, Plus, MoreHorizontal, Phone, Shield, UserCheck, X, Check, AlertCircle } from 'lucide-react';
import { Agent, PhoneNumber, Filters } from '../types';
import NumberTable from './NumberTable';
import SelectionToolbar from './SelectionToolbar';
import FilterPanel from './FilterPanel';
import { motion, AnimatePresence } from 'motion/react';

interface AgentManagementProps {
  agents: Agent[];
  numbers: PhoneNumber[];
  onUpdateNumber?: (id: string, updates: Partial<PhoneNumber>) => void;
}

const AgentManagement: React.FC<AgentManagementProps> = ({ agents, numbers, onUpdateNumber }) => {
  const [search, setSearch] = useState('');
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [recommendCount, setRecommendCount] = useState(10);
  
  // Local state for numbers in the modal
  const [modalNumbers, setModalNumbers] = useState<PhoneNumber[]>([]);
  const [modalFilters, setModalFilters] = useState<Filters>({
    carrier: 'all',
    province: 'all',
    city: 'all',
    search: '',
    frequency: 'all',
    displayStatus: 'all'
  });

  const filteredAgents = agents.filter(a => 
    a.name.includes(search) || a.account.includes(search)
  );

  const openEditModal = (agent: Agent) => {
    setActiveAgent(agent);
    // Initialize modal numbers with current assignment status
    setModalNumbers(numbers.map(n => ({
      ...n,
      selected: n.assignedAgentId === agent.id
    })));
    setIsEditModalOpen(true);
  };

  const filteredModalNumbers = useMemo(() => {
    return modalNumbers
      .filter((n) => {
        if (modalFilters.carrier !== 'all' && n.carrier !== modalFilters.carrier) return false;
        if (modalFilters.province !== 'all' && n.province !== modalFilters.province) return false;
        if (modalFilters.city !== 'all' && n.city !== modalFilters.city) return false;
        if (modalFilters.search && !n.number.includes(modalFilters.search)) return false;
        
        // Exclude exclusive numbers unless they are already assigned to this agent
        if (n.isExclusive && n.assignedAgentId !== activeAgent?.id) return false;
        
        return true;
      })
      .sort((a, b) => {
        // 1. Prioritize numbers already assigned to this agent (permanent assignment)
        const aAssigned = a.assignedAgentId === activeAgent?.id ? 1 : 0;
        const bAssigned = b.assignedAgentId === activeAgent?.id ? 1 : 0;
        if (aAssigned !== bAssigned) return bAssigned - aAssigned;

        // 2. Prioritize numbers currently selected in the modal (temporary selection)
        const aSelected = a.selected ? 1 : 0;
        const bSelected = b.selected ? 1 : 0;
        if (aSelected !== bSelected) return bSelected - aSelected;

        return 0;
      });
  }, [modalNumbers, modalFilters, activeAgent]);

  const handleToggleNumber = (id: string) => {
    setModalNumbers(prev => prev.map(n => n.id === id ? { ...n, selected: !n.selected } : n));
  };

  const handleAutoSelect = () => {
    // Recommendation logic: prioritize low usage and high success rate
    const pool = [...modalNumbers]
      .filter(n => !n.isExclusive || n.assignedAgentId === activeAgent?.id)
      .sort((a, b) => {
        if (a.usageCount !== b.usageCount) return a.usageCount - b.usageCount;
        return b.successRate - a.successRate;
      });

    const toSelect = pool.slice(0, recommendCount).map(n => n.id);
    setModalNumbers(prev => prev.map(n => ({
      ...n,
      selected: toSelect.includes(n.id)
    })));
  };

  const handleSaveAssignment = () => {
    if (!activeAgent) return;
    
    // Update all numbers in the main state
    modalNumbers.forEach(n => {
      const wasAssigned = n.assignedAgentId === activeAgent.id;
      const isSelected = n.selected;
      
      if (isSelected && !wasAssigned) {
        onUpdateNumber?.(n.id, { assignedAgentId: activeAgent.id });
      } else if (!isSelected && wasAssigned) {
        onUpdateNumber?.(n.id, { assignedAgentId: undefined });
      }
    });
    
    setIsEditModalOpen(false);
    setActiveAgent(null);
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">坐席管理</h1>
          <p className="text-xs text-gray-500 mt-1">管理外呼坐席账号，配置坐席与号码的对应关系。</p>
        </div>
        <button className="ant-btn-primary flex items-center gap-2">
          <Plus size={16} />
          <span>添加坐席</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-sm border border-gray-200 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input 
            type="text" 
            placeholder="搜索坐席姓名或账号..." 
            className="ant-input w-full pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-xs font-bold text-gray-600">坐席姓名</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600">主账号</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600">关联账号</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600">运行状态</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600">账号状态</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600">并发数量</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600">已分配号码</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.map((agent) => {
              const assignedNumbers = numbers.filter(n => n.assignedAgentId === agent.id);
              const isUnassigned = assignedNumbers.length === 0;
              
              return (
                <tr key={agent.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isUnassigned ? 'bg-gray-50/30' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${isUnassigned ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-ant-blue'} rounded-full flex items-center justify-center font-bold text-xs`}>
                        {agent.name.charAt(0)}
                      </div>
                      <span className={`text-sm font-medium ${isUnassigned ? 'text-gray-400' : 'text-gray-800'}`}>{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{agent.account}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {agent.associatedAccounts.slice(0, 3).map(acc => (
                        <span key={acc} className="px-1 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-sm border border-gray-200">
                          {acc}
                        </span>
                      ))}
                      {agent.associatedAccounts.length > 3 && (
                        <span className="text-[10px] text-gray-400">+{agent.associatedAccounts.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        agent.status === 'online' ? 'bg-emerald-500' :
                        agent.status === 'busy' ? 'bg-amber-500' :
                        'bg-gray-300'
                      }`} />
                      <span className="text-[10px] text-gray-500">
                        {agent.status === 'online' ? '在线' : agent.status === 'busy' ? '忙碌' : '离线'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Switch 
                      checked={agent.isEnabled} 
                      onChange={() => {}} // In a real app, update agent state
                      label={agent.isEnabled ? '已启用' : '已关闭'}
                      activeColor="bg-emerald-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className={`text-sm font-mono font-bold ${isUnassigned ? 'text-gray-300' : 'text-gray-700'}`}>
                        {assignedNumbers.length}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {isUnassigned ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-amber-500 bg-amber-50 px-2 py-1 rounded-sm border border-amber-100 w-fit">
                          <AlertCircle size={12} />
                          <span className="text-[10px] font-medium">待分配号码</span>
                        </div>
                        <button 
                          onClick={() => {
                            // Smart assign logic: find first available number and assign it
                            const availableNumber = numbers.find(n => !n.assignedAgentId);
                            if (availableNumber && onUpdateNumber) {
                              onUpdateNumber(availableNumber.id, { assignedAgentId: agent.id });
                            }
                          }}
                          className="text-[10px] text-ant-blue hover:underline"
                        >
                          智能选号
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {assignedNumbers.slice(0, 2).map(n => (
                          <span key={n.id} className="px-1.5 py-0.5 bg-blue-50 text-ant-blue text-[10px] rounded-sm border border-blue-100">
                            {n.number}
                          </span>
                        ))}
                        {assignedNumbers.length > 2 && <span className="text-[10px] text-gray-400">+{assignedNumbers.length - 2}</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => openEditModal(agent)}
                        className="text-ant-blue hover:text-ant-blue-hover text-xs font-medium"
                      >
                        编辑
                      </button>
                      <button className="text-red-500 hover:text-red-600 text-xs font-medium">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal (Includes Number Assignment) */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-5xl rounded-sm shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-ant-blue/10 rounded-sm">
                    <Shield className="text-ant-blue" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">编辑坐席 - {activeAgent?.name}</h2>
                    <p className="text-xs text-gray-500">配置坐席基本信息、并发限制及外呼号码。</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Basic Info Section */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600">坐席姓名</label>
                    <input type="text" className="ant-input w-full" defaultValue={activeAgent?.name} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600">登录账号</label>
                    <input type="text" className="ant-input w-full" defaultValue={activeAgent?.account} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600">并发限制</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        className="ant-input w-full bg-gray-50" 
                        value={modalNumbers.filter(n => n.selected).length} 
                        readOnly
                      />
                      <span className="text-xs text-gray-400 whitespace-nowrap">自动计算</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-600">关联账号 (每行一个)</label>
                  <textarea 
                    className="ant-input w-full min-h-[80px] py-2 font-mono text-xs" 
                    placeholder="请输入关联账号..."
                    defaultValue={activeAgent?.associatedAccounts.join('\n')}
                  />
                </div>

                <div className="h-px bg-gray-100" />

                {/* Number Assignment Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Phone size={14} className="text-ant-blue" />
                      号码分配
                    </h3>
                  </div>
                  
                  <FilterPanel filters={modalFilters} onChange={setModalFilters} />
                  
                  <SelectionToolbar 
                    selectedCount={modalNumbers.filter(n => n.selected).length}
                    totalCount={modalNumbers.length}
                    onAutoSelect={handleAutoSelect}
                    recommendCount={recommendCount}
                    onRecommendCountChange={setRecommendCount}
                  />

                  <NumberTable 
                    numbers={filteredModalNumbers} 
                    onToggle={handleToggleNumber}
                    allSelected={filteredModalNumbers.length > 0 && filteredModalNumbers.every(n => n.selected)}
                    onToggleAll={(checked) => setModalNumbers(prev => prev.map(n => ({ ...n, selected: checked })))}
                  />
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-sm transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveAssignment}
                  className="ant-btn-primary px-8 py-2 text-sm font-medium flex items-center gap-2"
                >
                  <Check size={16} />
                  保存修改
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentManagement;
