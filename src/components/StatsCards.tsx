import React from 'react';
import { PhoneNumber } from '../types';
import { Phone, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface StatsCardsProps {
  numbers: PhoneNumber[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ numbers }) => {
  const total = numbers.length;
  const active = numbers.filter(n => n.status === 'active').length;
  const cooldown = numbers.filter(n => n.status === 'cooldown').length;
  const avgSuccess = Math.round(numbers.reduce((acc, n) => acc + n.successRate, 0) / (total || 1));

  const stats = [
    { label: '总号码数', value: total, icon: Phone, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: '可用状态', value: active, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: '冷却中', value: cooldown, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: '已停用', value: numbers.filter(n => n.status === 'suspended').length, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-4 rounded-sm border border-gray-200 flex items-center gap-4">
          <div className={`w-10 h-10 ${stat.bg} rounded flex items-center justify-center ${stat.color}`}>
            <stat.icon size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
