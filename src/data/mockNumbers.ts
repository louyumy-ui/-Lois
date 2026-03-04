import { PhoneNumber, Carrier, NumberStatus, Agent } from '../types';

export const CARRIERS: Carrier[] = ['中国移动', '中国联通', '中国电信'];
export const PROVINCES = [
  { name: '广东省', cities: ['广州市', '深圳市', '珠海市', '东莞市'] },
  { name: '北京市', cities: ['北京市'] },
  { name: '上海市', cities: ['上海市'] },
  { name: '浙江省', cities: ['杭州市', '宁波市', '温州市'] },
  { name: '江苏省', cities: ['南京市', '苏州市', '无锡市'] },
];

const REMARKS = ['优质线路', '测试号码', '高频封号风险', '仅限回访', 'VIP专线', ''];

export const generateMockAgents = (count: number = 10): Agent[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `agent-${i}`,
    name: `坐席-${i + 1}`,
    account: `user${100 + i}`,
    associatedAccounts: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => `acc-${i}-${j + 1}`),
    status: Math.random() > 0.3 ? 'online' : (Math.random() > 0.5 ? 'busy' : 'offline'),
    isEnabled: Math.random() > 0.1,
    assignedNumbers: [],
    concurrency: 0, // Will be updated based on assigned numbers
  }));
};

export const generateMockData = (count: number = 100, agents: Agent[] = []): PhoneNumber[] => {
  return Array.from({ length: count }, (_, i) => {
    const provinceObj = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
    const city = provinceObj.cities[Math.floor(Math.random() * provinceObj.cities.length)];
    const assignedAgent = agents.length > 0 && Math.random() * 100 > 50 ? agents[Math.floor(Math.random() * agents.length)] : null;
    
    // Generate Landline format: 010-87654321
    const areaCode = Math.floor(10 + Math.random() * 80);
    const localNum = Math.floor(20000000 + Math.random() * 70000000);
    
    const num: PhoneNumber = {
      id: `num-${i}`,
      number: `0${areaCode}-${localNum}`,
      carrier: CARRIERS[Math.floor(Math.random() * CARRIERS.length)],
      province: provinceObj.name,
      city: city,
      usageCount: Math.floor(Math.random() * 500),
      successRate: Math.floor(70 + Math.random() * 25),
      status: (Math.random() > 0.1 ? 'active' : (Math.random() > 0.5 ? 'cooldown' : 'suspended')) as NumberStatus,
      selected: false,
      lastUsed: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
      isDisplay: Math.random() > 0.3,
      remark: REMARKS[Math.floor(Math.random() * REMARKS.length)],
      assignedAgentId: assignedAgent?.id,
      isExclusive: Math.random() > 0.9, // 10% exclusive
      exclusiveTo: Math.random() > 0.9 ? 'VIP部门' : undefined,
      assignedScriptId: Math.random() > 0.8 ? Math.floor(1 + Math.random() * 4) : undefined,
    };

    if (assignedAgent) {
      assignedAgent.assignedNumbers.push(num.id);
    }

    return num;
  });
};
