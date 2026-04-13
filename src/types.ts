export interface Customer {
  id: string;
  name: string;
  taxId: string;
  address: string;
  contactPerson: string;
  phone: string;
}

export interface Project {
  id: string;
  customerId: string;
  customerName: string; // 僱傭者
  title: string;
  type: '廢棄物清除' | '工業設備清洗' | 'VOC回收工程' | '污泥脫水處理' | '工程承包';
  status: '報價中' | '施工中' | '已完工' | '已結案';
  contractAmount: number; // 賺取的錢
  startDate: string; // 拍下案子的日期
  endDate: string;
}

export interface Asset {
  id: string;
  name: string;
  plateNumber: string;
  type: '抽油車' | '脫水機' | '清洗設備' | '其他';
  status: '可用' | '施工中' | '維修中';
  description: string;
  lastMaintenance: string;
  specs: { [key: string]: string };
  image: string;
}

export interface Employee {
  id: string;
  name: string;
  age: number;
  role: string;
  field: string; // 負責領域
  avatar: string;
  phone: string;
  email: string;
  joinDate: string;
  certs: string[];
  bio: string;
}

export interface VocRegionData {
  region: string;
  vocType: string;
  amount: number;
}

export interface VocLog {
  id: string;
  chemicalName: string;
  percentage: number; // 佔比 %
  location: string;
  timestamp: string;
  assetName: string;
  amount: number; // 回收量
}

export interface VocEngineeringData {
  id: string;
  customer: string;
  plant: string;
  tank: string;
  date: string;
  content: string;
  capacity: number;
  type: string;
}

export interface WasteLog {
  id: string;
  name: string;
  region: string;
  amount: number;
  temp: number;
  volTemp: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  date: string;
  status: '已付款' | '未付款' | '已作廢';
}

export interface CCTV {
  id: string;
  name: string;
  location: string;
  status: '在線' | '離線';
  streamUrl: string;
}

export interface Dispatch {
  id: string;
  projectId: string;
  employeeId: string;
  assetId: string;
  workDate: string;
  checkInTime?: string;
  location?: { lat: number; lng: number };
}
