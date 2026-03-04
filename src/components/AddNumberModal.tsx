import React, { useState } from 'react';
import { X, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { PhoneNumber, Carrier, NumberStatus } from '../types';
import { CARRIERS, PROVINCES } from '../data/mockNumbers';

interface AddNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PhoneNumber>) => void;
  editingNumber: PhoneNumber | null;
}

const AddNumberModal: React.FC<AddNumberModalProps> = ({ isOpen, onClose, onSave, editingNumber }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'import'>('manual');
  const [formData, setFormData] = useState<Partial<PhoneNumber>>(
    editingNumber || {
      number: '',
      carrier: CARRIERS[0],
      province: PROVINCES[0].name,
      city: PROVINCES[0].cities[0],
      status: 'active',
      isDisplay: true,
      remark: '',
    }
  );

  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  if (!isOpen) return null;

  const selectedProvince = PROVINCES.find(p => p.name === formData.province);

  const handleBatchImport = () => {
    setIsImporting(true);
    // Simulate parsing
    setTimeout(() => {
      const lines = importText.split('\n').filter(l => l.trim());
      lines.forEach(line => {
        onSave({
          number: line.trim(),
          carrier: CARRIERS[Math.floor(Math.random() * CARRIERS.length)],
          province: PROVINCES[0].name,
          city: PROVINCES[0].cities[0],
          status: 'active',
          isDisplay: true,
          remark: '批量导入',
        });
      });
      setIsImporting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-sm shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <h3 className="text-base font-bold text-gray-800">{editingNumber ? '编辑号码' : '新增号码'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {!editingNumber && (
          <div className="flex border-b border-gray-100 shrink-0">
            <button 
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'manual' ? 'text-ant-blue border-b-2 border-ant-blue' : 'text-gray-500 hover:text-gray-700'}`}
            >
              手动填写
            </button>
            <button 
              onClick={() => setActiveTab('import')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'import' ? 'text-ant-blue border-b-2 border-ant-blue' : 'text-gray-500 hover:text-gray-700'}`}
            >
              自动导入
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'manual' || editingNumber ? (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">外呼号码</label>
                <input 
                  type="text" 
                  className="ant-input w-full" 
                  placeholder="请输入座机或手机号"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">运营商</label>
                  <select 
                    className="ant-input w-full bg-white"
                    value={formData.carrier}
                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value as any })}
                  >
                    {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">账号状态</label>
                  <select 
                    className="ant-input w-full bg-white"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="active">活跃</option>
                    <option value="cooldown">冷却中</option>
                    <option value="suspended">已停用</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">归属省份</label>
                  <select 
                    className="ant-input w-full bg-white"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value, city: PROVINCES.find(p => p.name === e.target.value)?.cities[0] || '' })}
                  >
                    {PROVINCES.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">归属城市</label>
                  <select 
                    className="ant-input w-full bg-white"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    {selectedProvince?.cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">外显状态</span>
                  <span className="text-[10px] text-gray-400">开启后该号码将作为外显号码使用</span>
                </div>
                <div 
                  onClick={() => setFormData({ ...formData, isDisplay: !formData.isDisplay })}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${
                    formData.isDisplay ? 'bg-ant-blue' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    formData.isDisplay ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">备注</label>
                <textarea 
                  className="ant-input w-full min-h-[80px] py-2" 
                  placeholder="请输入备注信息..."
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                />
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-sm bg-gray-50 flex flex-col items-center justify-center gap-2 py-8">
                <Upload className="text-gray-400" size={32} />
                <span className="text-sm text-gray-600">点击或拖拽文件到此处导入</span>
                <span className="text-xs text-gray-400">支持 .csv, .xlsx 格式，单次最多1000条</span>
                <button className="mt-2 text-ant-blue text-xs font-medium hover:underline">下载模板</button>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600">或直接粘贴号码 (每行一个)</label>
                <textarea 
                  className="ant-input w-full min-h-[150px] font-mono text-sm py-2"
                  placeholder="010-87654321&#10;021-12345678"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                />
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-sm border border-blue-100">
                <AlertCircle size={14} className="text-ant-blue mt-0.5 shrink-0" />
                <p className="text-[10px] text-blue-700 leading-relaxed">
                  导入后系统将自动识别运营商及归属地。若无法识别，将默认分配至当前配置的第一个运营商。
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 shrink-0">
          <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-sm">取消</button>
          <button 
            onClick={() => activeTab === 'manual' || editingNumber ? onSave(formData) : handleBatchImport()} 
            disabled={isImporting}
            className="ant-btn-primary px-8 py-2 text-sm font-medium flex items-center gap-2"
          >
            {isImporting && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {isImporting ? '导入中...' : '确认'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddNumberModal;
