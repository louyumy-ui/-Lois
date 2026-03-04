export type Carrier = '中国移动' | '中国联通' | '中国电信' | '虚拟运营商';

export type NumberStatus = 'active' | 'cooldown' | 'suspended';

export interface PhoneNumber {
  id: string;
  number: string;
  carrier: Carrier;
  province: string;
  city: string;
  usageCount: number;
  successRate: number;
  status: NumberStatus;
  selected: boolean;
  lastUsed: string;
  isDisplay: boolean; // 是否外显
  remark: string; // 备注
  assignedAgentId?: string; // 关联坐席ID
  assignedScriptId?: number; // 关联话术ID
  isExclusive?: boolean; // 是否专属/特殊处理
  exclusiveTo?: string; // 专属坐席/部门名称
}

export interface Agent {
  id: string;
  name: string;
  account: string;
  associatedAccounts: string[]; // 关联的多个账号列表
  status: 'online' | 'offline' | 'busy';
  isEnabled: boolean; // 账号启用状态
  assignedNumbers: string[]; // 关联的号码ID列表
  concurrency: number; // 并发数量
}

export interface CarrierConfig {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface RegionConfig {
  id: string;
  province: string;
  cities: string[];
}

export interface Filters {
  carrier: string;
  province: string;
  city: string;
  search: string;
  frequency?: 'all' | 'low' | 'high';
  displayStatus?: 'all' | 'yes' | 'no';
  accountStatus?: 'all' | 'active' | 'suspended';
  cooldownStatus?: 'all' | 'yes' | 'no';
}
