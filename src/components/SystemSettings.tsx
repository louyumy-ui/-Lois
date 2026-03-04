import React, { useState } from 'react';
import { Settings, Globe, MapPin, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { CARRIERS, PROVINCES } from '../data/mockNumbers';

const SystemSettings: React.FC = () => {
  const [carriers, setCarriers] = useState(CARRIERS);
  const [provinces, setProvinces] = useState(PROVINCES);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">系统设置</h1>
          <p className="text-xs text-gray-500 mt-1">配置运营商、归属地等基础数据，管理系统核心参数。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Carrier Configuration */}
        <div className="bg-white p-5 rounded-sm border border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 text-ant-blue rounded flex items-center justify-center">
                <Globe size={16} />
              </div>
              <h2 className="text-base font-bold text-gray-800">运营商配置</h2>
            </div>
            <button className="p-1.5 text-ant-blue hover:bg-blue-50 rounded transition-all">
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-2">
            {carriers.map((carrier, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-sm border border-gray-100 group">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="text-sm text-gray-800">{carrier}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="p-1 text-gray-400 hover:text-ant-blue hover:bg-blue-50 rounded">
                    <Edit2 size={14} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Region Configuration */}
        <div className="bg-white p-5 rounded-sm border border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded flex items-center justify-center">
                <MapPin size={16} />
              </div>
              <h2 className="text-base font-bold text-gray-800">归属地配置</h2>
            </div>
            <button className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-all">
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
            {provinces.map((province, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-sm border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 text-sm">{province.name}</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded">
                      <Plus size={12} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {province.cities.map((city, j) => (
                    <span key={j} className="px-2 py-0.5 bg-white border border-gray-200 rounded-sm text-[10px] text-gray-600 flex items-center gap-2 group">
                      {city}
                      <button className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600">
                        <Trash2 size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
