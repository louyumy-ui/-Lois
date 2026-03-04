import React, { useState, useMemo, useCallback } from 'react';
import AppSidebar from './components/AppSidebar';
import StatsCards from './components/StatsCards';
import FilterPanel from './components/FilterPanel';
import SelectionToolbar from './components/SelectionToolbar';
import NumberTable from './components/NumberTable';
import AddNumberModal from './components/AddNumberModal';
import CallScripts from './components/CallScripts';
import AgentManagement from './components/AgentManagement';
import SystemSettings from './components/SystemSettings';
import { generateMockData, generateMockAgents } from './data/mockNumbers';
import { PhoneNumber, Filters, Agent } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, User, Bell, Search, RefreshCw, Plus, X, Menu, FileText } from 'lucide-react';

const initialAgents = generateMockAgents(12);
const initialData = generateMockData(120, initialAgents);

export default function App() {
  const [activeTab, setActiveTab] = useState('numbers');
  const [openTabs, setOpenTabs] = useState<{id: string, label: string}[]>([
    { id: 'numbers', label: '号码管理' }
  ]);
  const [numbers, setNumbers] = useState<PhoneNumber[]>(initialData);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [filters, setFilters] = useState<Filters>({
    carrier: 'all',
    province: 'all',
    city: 'all',
    search: '',
    accountStatus: 'all',
    displayStatus: 'all',
    cooldownStatus: 'all',
  });

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    const labels: Record<string, string> = {
      'dashboard': '任务管理',
      'numbers': '号码管理',
      'users': '坐席管理',
      'settings': '系统设置',
      'sms_remind': '短信提醒',
      'demand_list': '需求列表'
    };
    if (!openTabs.find(t => t.id === id)) {
      setOpenTabs(prev => [...prev, { id, label: labels[id] || id }]);
    }
  };

  const closeTab = (e: any, id: string) => {
    e.stopPropagation();
    if (openTabs.length === 1) return;
    const newTabs = openTabs.filter(t => t.id !== id);
    setOpenTabs(newTabs);
    if (activeTab === id) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNumber, setEditingNumber] = useState<PhoneNumber | null>(null);

  const handleUpdateNumber = (id: string, updates: Partial<PhoneNumber>) => {
    setNumbers(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const handleSaveNumber = (numberData: any) => {
    if (editingNumber) {
      setNumbers(prev => prev.map(n => n.id === editingNumber.id ? { ...n, ...numberData } : n));
    } else {
      const newNumber: PhoneNumber = {
        id: `num-${Date.now()}`,
        usageCount: 0,
        successRate: 0,
        selected: false,
        lastUsed: '-',
        ...numberData
      };
      setNumbers(prev => [newNumber, ...prev]);
    }
    setIsAddModalOpen(false);
    setEditingNumber(null);
  };

  const filtered = useMemo(() => {
    return numbers.filter((n) => {
      if (filters.carrier !== 'all' && n.carrier !== filters.carrier) return false;
      if (filters.province !== 'all' && n.province !== filters.province) return false;
      if (filters.city !== 'all' && n.city !== filters.city) return false;
      if (filters.search && !n.number.includes(filters.search)) return false;
      
      // Account Status
      if (filters.accountStatus === 'active' && n.status !== 'active') return false;
      if (filters.accountStatus === 'suspended' && n.status !== 'suspended') return false;
      
      // Cooldown Status
      if (filters.cooldownStatus === 'yes' && n.status !== 'cooldown') return false;
      if (filters.cooldownStatus === 'no' && n.status === 'cooldown') return false;
      
      // Display Status
      if (filters.displayStatus === 'yes' && !n.isDisplay) return false;
      if (filters.displayStatus === 'no' && n.isDisplay) return false;
      
      return true;
    });
  }, [numbers, filters]);

  const breadcrumbs = useMemo(() => {
    const map: Record<string, string[]> = {
      'numbers': ['首页', '话术管理 (管理端)', '号码管理'],
      'users': ['首页', '话术管理 (管理端)', '坐席管理'],
      'settings': ['首页', '系统设置'],
      'sms_remind': ['首页', '需求管理', '短信提醒'],
      'demand_list': ['首页', '需求管理', '需求列表'],
      'dashboard': ['首页', '任务管理'],
    };
    return map[activeTab] || ['首页', activeTab];
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-ant-bg font-sans text-gray-900 overflow-hidden">
      <AppSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Menu size={14} className="mr-2 cursor-pointer hover:text-ant-blue" />
            {breadcrumbs.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={i === breadcrumbs.length - 1 ? 'text-gray-800' : ''}>{b}</span>
                {i < breadcrumbs.length - 1 && <ChevronRight size={12} />}
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium bg-emerald-50 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              超级管理员
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
              <img src="https://picsum.photos/seed/admin/100/100" alt="Avatar" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* Tabs Bar */}
        <div className="h-10 bg-white border-b border-gray-200 flex items-center px-4 gap-1 shrink-0 overflow-x-auto scrollbar-hide">
          {openTabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-8 px-3 flex items-center gap-2 text-xs border rounded-t cursor-pointer transition-all ${
                activeTab === tab.id 
                  ? 'bg-white border-gray-200 border-b-white text-ant-blue -mb-[1px] z-10' 
                  : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${activeTab === tab.id ? 'bg-ant-blue' : 'bg-gray-300'}`} />
              {tab.label}
              <X 
                size={12} 
                className="hover:bg-gray-200 rounded-full p-0.5" 
                onClick={(e) => closeTab(e, tab.id)}
              />
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white p-6 rounded shadow-sm min-h-full"
            >
              <div className="flex items-center gap-2 mb-6 border-l-4 border-ant-blue pl-3">
                <h2 className="text-lg font-bold text-gray-800">
                  {openTabs.find(t => t.id === activeTab)?.label || activeTab}
                </h2>
              </div>

              {activeTab === 'numbers' ? (
                <div className="space-y-6">
                  {/* Search Bar Area */}
                  <div className="flex flex-wrap items-center gap-4 bg-gray-50/50 p-4 rounded border border-gray-100">
                    <button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="ant-btn-primary flex items-center gap-2"
                    >
                      <Plus size={16} />
                      新增号码
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setFilters(prev => ({ ...prev, frequency: prev.frequency === 'cooldown' ? 'all' : 'cooldown' }))}
                        className={`px-3 py-1.5 text-xs rounded-sm border transition-all ${
                          filters.frequency === 'cooldown' 
                            ? 'bg-amber-50 border-amber-200 text-amber-600' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-ant-blue'
                        }`}
                      >
                        仅看冷却中
                      </button>
                      <button 
                        onClick={() => setFilters(prev => ({ ...prev, frequency: prev.frequency === 'suspended' ? 'all' : 'suspended' }))}
                        className={`px-3 py-1.5 text-xs rounded-sm border transition-all ${
                          filters.frequency === 'suspended' 
                            ? 'bg-red-50 border-red-200 text-red-600' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-ant-blue'
                        }`}
                      >
                        仅看已停用
                      </button>
                      <button 
                        onClick={() => setFilters(prev => ({ ...prev, frequency: prev.frequency === 'no_display' ? 'all' : 'no_display' }))}
                        className={`px-3 py-1.5 text-xs rounded-sm border transition-all ${
                          filters.frequency === 'no_display' 
                            ? 'bg-gray-50 border-gray-200 text-gray-400' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-ant-blue'
                        }`}
                      >
                        仅看无外显
                      </button>
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-2" />

                    <div className="flex items-center gap-2 text-sm flex-1">
                      <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                          type="text"
                          placeholder="搜索号码..."
                          className="ant-input w-full pl-9 bg-white"
                          value={filters.search}
                          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                      </div>
                      <button 
                        onClick={() => setFilters({ carrier: 'all', province: 'all', city: 'all', search: '', frequency: 'all', displayStatus: 'all' })}
                        className="px-4 py-1.5 border border-gray-300 rounded-sm text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <RefreshCw size={14} />
                        重置
                      </button>
                    </div>
                  </div>

                  <StatsCards numbers={numbers} />
                  
                  <div className="space-y-6">
                    <FilterPanel filters={filters} onChange={setFilters} />
                    <NumberTable 
                      numbers={filtered} 
                      isSelectable={false} 
                      onUpdateNumber={handleUpdateNumber}
                      onEdit={setEditingNumber}
                    />
                  </div>
                </div>
              ) : activeTab === 'users' ? (
                <AgentManagement 
                  agents={agents} 
                  numbers={numbers} 
                  onUpdateNumber={handleUpdateNumber}
                />
              ) : activeTab === 'settings' ? (
                <SystemSettings />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FileText size={32} />
                  </div>
                  <p className="text-sm">暂无数据</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Add/Edit Number Modal */}
      <AnimatePresence>
        {(isAddModalOpen || editingNumber) && (
          <AddNumberModal 
            isOpen={true}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingNumber(null);
            }}
            onSave={handleSaveNumber}
            editingNumber={editingNumber}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

