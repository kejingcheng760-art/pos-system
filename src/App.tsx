import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Truck, 
  Trash2, 
  Wind, 
  UserRound, 
  Receipt, 
  Menu, 
  PanelLeftClose,
  PanelLeftOpen,
  X, 
  Plus, 
  Search,
  ChevronRight,
  Camera,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Thermometer,
  Droplets,
  Leaf,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Award,
  ArrowLeft,
  Settings,
  Info,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { cn } from './lib/utils';
import { Customer, Project, Employee, Asset, VocRegionData, CCTV, VocLog, VocEngineeringData, WasteLog, Invoice } from './types';

// --- Constants ---
const COLORS = ['#10b981', '#06b6d4', '#84cc16', '#f59e0b', '#6366f1', '#ec4899'];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200" 
        : "text-emerald-800/60 hover:bg-emerald-50 hover:text-emerald-700"
    )}
  >
    <Icon size={20} className={cn("transition-transform duration-200", active ? "scale-110" : "group-hover:scale-110")} />
    <span className="font-medium">{label}</span>
  </button>
);

const Card = ({ children, className, title, icon: Icon }: { children: React.ReactNode, className?: string, title?: string, icon?: any, key?: React.Key }) => (
  <div className={cn("bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-sm overflow-hidden", className)}>
    {title && (
      <div className="px-6 py-4 border-b border-emerald-50 flex items-center gap-2">
        {Icon && <Icon size={18} className="text-emerald-600" />}
        <h3 className="font-semibold text-emerald-900">{title}</h3>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

const StatCard = ({ label, value, icon: Icon, trend, color }: { label: string, value: string | number, icon: any, trend?: string, color: string }) => (
  <Card className="relative overflow-hidden group border-none">
    <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-110", color)} />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-sm font-medium text-emerald-800/60 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-emerald-950">{value}</h3>
        {trend && (
          <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> {trend}
          </p>
        )}
      </div>
      <div className={cn("p-3 rounded-xl text-white shadow-md", color)}>
        <Icon size={20} />
      </div>
    </div>
  </Card>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedCCTV, setSelectedCCTV] = useState<CCTV | null>(null);
  const [data, setData] = useState<{
    customers: Customer[],
    projects: Project[],
    employees: Employee[],
    assets: Asset[],
    cctvs: CCTV[],
    vocLogs: VocLog[],
    vocEngineering: VocEngineeringData[],
    vocRegions: VocRegionData[],
    wasteLogs: WasteLog[],
    invoices: Invoice[],
    dashboard: any
  }>({
    customers: [],
    projects: [],
    employees: [],
    assets: [],
    cctvs: [],
    vocLogs: [],
    vocEngineering: [],
    vocRegions: [],
    wasteLogs: [],
    invoices: [],
    dashboard: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cust, proj, emp, asst, cctv, vocLog, vocEng, vocReg, waste, inv, dash] = await Promise.all([
          fetch('/api/customers').then(r => r.json()),
          fetch('/api/projects').then(r => r.json()),
          fetch('/api/employees').then(r => r.json()),
          fetch('/api/assets').then(r => r.json()),
          fetch('/api/cctv').then(r => r.json()),
          fetch('/api/voc-logs').then(r => r.json()),
          fetch('/api/voc-engineering').then(r => r.json()),
          fetch('/api/voc-regions').then(r => r.json()),
          fetch('/api/waste-logs').then(r => r.json()),
          fetch('/api/invoices').then(r => r.json()),
          fetch('/api/dashboard').then(r => r.json())
        ]);
        setData({ customers: cust, projects: proj, employees: emp, assets: asst, cctvs: cctv, vocLogs: vocLog, vocEngineering: vocEng, vocRegions: vocReg, wasteLogs: waste, invoices: inv, dashboard: dash });
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  // Reset detail views when tab changes
  useEffect(() => {
    setSelectedEmployee(null);
    setSelectedAsset(null);
    setSelectedCCTV(null);
    setSearchQuery(''); // Also clear search when switching tabs
  }, [activeTab]);

  const handleAddData = () => {
    if (isEditMode && editingId) {
      // Update logic
      setData(prev => {
        const newData = { ...prev };
        switch (activeTab) {
          case 'customers':
            newData.customers = prev.customers.map(c => c.id === editingId ? { ...c, ...formData } : c);
            break;
          case 'projects':
            newData.projects = prev.projects.map(p => p.id === editingId ? { ...p, ...formData, contractAmount: Number(formData.contractAmount) } : p);
            break;
          case 'employees':
            newData.employees = prev.employees.map(e => e.id === editingId ? { ...e, ...formData, age: Number(formData.age) } : e);
            break;
          case 'assets':
            newData.assets = prev.assets.map(a => a.id === editingId ? { ...a, ...formData } : a);
            break;
          case 'voc':
            newData.vocEngineering = prev.vocEngineering.map(v => v.id === editingId ? { ...v, ...formData, capacity: Number(formData.capacity) } : v);
            break;
          case 'waste':
            newData.wasteLogs = prev.wasteLogs.map(w => w.id === editingId ? { ...w, ...formData, amount: Number(formData.amount), temp: Number(formData.temp), volTemp: Number(formData.volTemp) } : w);
            break;
          case 'pos':
            newData.invoices = prev.invoices.map(i => i.id === editingId ? { ...i, ...formData, amount: Number(formData.amount) } : i);
            break;
        }
        return newData;
      });
    } else {
      // Create logic
      switch (activeTab) {
        case 'customers':
          const newCustomer = { ...formData, id: Date.now().toString() };
          setData(prev => ({ ...prev, customers: [newCustomer, ...prev.customers] }));
          break;
        case 'projects':
          const newProject = { ...formData, id: Date.now().toString(), contractAmount: Number(formData.contractAmount), status: '報價中' };
          setData(prev => ({ ...prev, projects: [newProject, ...prev.projects] }));
          break;
        case 'employees':
          const newEmployee = { 
            ...formData, 
            id: Date.now().toString(), 
            age: Number(formData.age), 
            avatar: `https://picsum.photos/seed/${formData.name}/200/200`,
            certs: formData.certs?.split(',') || [],
            joinDate: new Date().toISOString().split('T')[0]
          };
          setData(prev => ({ ...prev, employees: [newEmployee, ...prev.employees] }));
          break;
        case 'assets':
          const newAsset = { 
            ...formData, 
            id: Date.now().toString(), 
            image: `https://picsum.photos/seed/${formData.name}/400/300`,
            status: '可用',
            specs: {} 
          };
          setData(prev => ({ ...prev, assets: [newAsset, ...prev.assets] }));
          break;
        case 'voc':
          const newVoc = { ...formData, id: Date.now().toString(), capacity: Number(formData.capacity) };
          setData(prev => ({ ...prev, vocEngineering: [newVoc, ...prev.vocEngineering] }));
          break;
        case 'waste':
          const newWaste = { 
            ...formData, 
            id: Date.now().toString(), 
            amount: Number(formData.amount), 
            temp: Number(formData.temp), 
            volTemp: Number(formData.volTemp) 
          };
          setData(prev => ({ ...prev, wasteLogs: [newWaste, ...prev.wasteLogs] }));
          break;
        case 'pos':
          const newInvoice = { ...formData, id: Date.now().toString(), amount: Number(formData.amount), status: '未付款' };
          setData(prev => ({ ...prev, invoices: [newInvoice, ...prev.invoices] }));
          break;
      }
    }
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setFormData({});
  };

  const openEditModal = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const renderAddModal = () => {
    if (!isAddModalOpen) return null;

    const fields = {
      customers: [
        { name: 'name', label: '公司名稱', type: 'text' },
        { name: 'taxId', label: '統一編號', type: 'text' },
        { name: 'contactPerson', label: '聯絡人', type: 'text' },
        { name: 'phone', label: '電話', type: 'text' },
        { name: 'address', label: '地址', type: 'text' },
      ],
      projects: [
        { name: 'title', label: '工程名稱', type: 'text' },
        { name: 'customerName', label: '客戶名稱', type: 'text' },
        { name: 'startDate', label: '開始日期', type: 'date' },
        { name: 'contractAmount', label: '合約金額', type: 'number' },
      ],
      employees: [
        { name: 'name', label: '姓名', type: 'text' },
        { name: 'role', label: '職位', type: 'text' },
        { name: 'field', label: '負責領域', type: 'text' },
        { name: 'age', label: '年齡', type: 'number' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: '電話', type: 'text' },
        { name: 'certs', label: '持有證照 (逗號分隔)', type: 'text' },
        { name: 'bio', label: '個人簡介', type: 'textarea' },
      ],
      assets: [
        { name: 'name', label: '設備名稱', type: 'text' },
        { name: 'plateNumber', label: '車牌/編號', type: 'text' },
        { name: 'type', label: '類型', type: 'text' },
        { name: 'description', label: '描述', type: 'textarea' },
      ],
      voc: [
        { name: 'customer', label: '客戶', type: 'text' },
        { name: 'plant', label: '廠區', type: 'text' },
        { name: 'tank', label: '儲槽', type: 'text' },
        { name: 'date', label: '日期', type: 'date' },
        { name: 'content', label: '內容物', type: 'text' },
        { name: 'capacity', label: '容量 (KL)', type: 'number' },
        { name: 'type', label: '型式', type: 'text' },
      ],
      waste: [
        { name: 'name', label: '化學品名稱', type: 'text' },
        { name: 'region', label: '來源地區', type: 'text' },
        { name: 'amount', label: '處理量 (kg)', type: 'number' },
        { name: 'temp', label: '當地溫度 (°C)', type: 'number' },
        { name: 'volTemp', label: '揮發溫度 (°C)', type: 'number' },
      ],
      pos: [
        { name: 'invoiceNumber', label: '發票號碼', type: 'text' },
        { name: 'customerName', label: '客戶名稱', type: 'text' },
        { name: 'amount', label: '金額', type: 'number' },
        { name: 'date', label: '日期', type: 'date' },
      ]
    }[activeTab as keyof typeof fields] || [];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/20 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-emerald-100"
        >
          <div className="px-8 py-6 bg-emerald-700 text-white flex justify-between items-center">
            <h3 className="text-xl font-black tracking-tight">{isEditMode ? '修改數據資料' : '新增數據資料'}</h3>
            <button onClick={() => { setIsAddModalOpen(false); setIsEditMode(false); setEditingId(null); setFormData({}); }} className="hover:rotate-90 transition-transform">
              <X size={24} />
            </button>
          </div>
          <div className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
            {fields.map(field => (
              <div key={field.name}>
                <label className="block text-xs font-black text-emerald-800 uppercase tracking-widest mb-1.5">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 focus:border-emerald-500 outline-none transition-all text-sm min-h-[100px]"
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  />
                ) : (
                  <input 
                    type={field.type}
                    className="w-full px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 focus:border-emerald-500 outline-none transition-all text-sm"
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="p-8 bg-emerald-50/50 border-t border-emerald-100 flex gap-4">
            <button 
              onClick={() => { setIsAddModalOpen(false); setIsEditMode(false); setEditingId(null); setFormData({}); }}
              className="flex-1 py-3 rounded-xl font-bold text-emerald-700 border border-emerald-200 hover:bg-white transition-all"
            >
              取消
            </button>
            <button 
              onClick={handleAddData}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-700 shadow-lg shadow-emerald-200 hover:bg-emerald-800 transition-all"
            >
              {isEditMode ? '確認修改' : '確認新增'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="執行中工程" value={data.dashboard?.activeProjects || 0} icon={Briefcase} trend="+2 本週" color="bg-emerald-600" />
              <StatCard label="合作客戶" value={data.dashboard?.totalCustomers || 0} icon={Users} trend="+1 新客戶" color="bg-teal-600" />
              <StatCard label="可用設備" value={data.dashboard?.availableAssets || 0} icon={Truck} trend="85% 使用率" color="bg-lime-600" />
              <StatCard label="VOC 回收量" value="1,240 m³" icon={Wind} trend="+12% 較上月" color="bg-cyan-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="台灣各縣市 VOCs 含量分佈" icon={PieChart}>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.vocRegions}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="amount"
                        nameKey="region"
                        label={({ region, percent }) => `${region} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.vocRegions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="近期工程進度" icon={Clock}>
                <div className="space-y-4">
                  {data.projects.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2 rounded-lg",
                          p.status === '施工中' ? "bg-emerald-100 text-emerald-600" : "bg-teal-100 text-teal-600"
                        )}>
                          {p.status === '施工中' ? <Clock size={18} /> : <CheckCircle2 size={18} />}
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-900">{p.title}</p>
                          <p className="text-xs text-emerald-700/60">{p.customerName} • {p.startDate}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-700">
                        ${p.contractAmount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );
      
      case 'projects':
        const filteredProjects = data.projects.filter(p => 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.customerName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <Card title="工程案件中心" icon={Briefcase}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-emerald-100">
                    <th className="pb-4 font-semibold text-emerald-800">工程名稱</th>
                    <th className="pb-4 font-semibold text-emerald-800 flex items-center gap-2">
                      <Users size={16} /> 僱傭者 (Customer)
                    </th>
                    <th className="pb-4 font-semibold text-emerald-800 flex items-center gap-2">
                      <Calendar size={16} /> 拍下日期 (Start Date)
                    </th>
                    <th className="pb-4 font-semibold text-emerald-800 flex items-center gap-2">
                      <DollarSign size={16} /> 賺取金額 (Amount)
                    </th>
                    <th className="pb-4 font-semibold text-emerald-800">狀態</th>
                    <th className="pb-4 font-semibold text-emerald-800">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {filteredProjects.map(p => (
                    <tr key={p.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-4 font-medium text-emerald-950">{p.title}</td>
                      <td className="py-4 text-emerald-800/70">{p.customerName}</td>
                      <td className="py-4 text-emerald-800/70">{p.startDate}</td>
                      <td className="py-4 font-mono font-bold text-emerald-600">
                        ${p.contractAmount.toLocaleString()}
                      </td>
                      <td className="py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold",
                          p.status === '施工中' ? "bg-blue-100 text-blue-700" : 
                          p.status === '報價中' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                        )}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button onClick={() => openEditModal(p)} className="text-emerald-600 hover:text-emerald-800 font-bold text-xs">修改</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );

      case 'assets':
        const filteredAssets = data.assets.filter(a => 
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <AnimatePresence mode="wait">
            {selectedAsset ? (
              <motion.div
                key="asset-detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <button 
                  onClick={() => setSelectedAsset(null)}
                  className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors mb-4"
                >
                  <ArrowLeft size={20} /> 返回設備列表
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 space-y-6">
                    <Card className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden rounded-xl mb-4">
                        <img src={selectedAsset.image} alt={selectedAsset.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-2xl font-black text-emerald-950">{selectedAsset.name}</h3>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold uppercase",
                          selectedAsset.status === '可用' ? "bg-emerald-100 text-emerald-700" : 
                          selectedAsset.status === '維修中' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {selectedAsset.status}
                        </span>
                      </div>
                      <p className="text-emerald-600 font-bold text-sm mb-4">{selectedAsset.type} • {selectedAsset.plateNumber}</p>
                      <div className="pt-4 border-t border-emerald-50 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-emerald-800/60 font-medium flex items-center gap-2"><Clock size={14}/> 最後保養</span>
                          <span className="text-emerald-950 font-bold">{selectedAsset.lastMaintenance}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-emerald-800/60 font-medium flex items-center gap-2"><Activity size={14}/> 運作狀態</span>
                          <span className="text-emerald-600 font-bold">良好</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    <Card title="設備介紹" icon={Info}>
                      <p className="text-emerald-900/80 leading-relaxed text-lg">
                        {selectedAsset.description}
                      </p>
                    </Card>

                    <Card title="技術規格 (Specifications)" icon={Settings}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(selectedAsset.specs).map(([key, value]) => (
                          <div key={key} className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">{key}</p>
                            <p className="text-lg font-black text-emerald-950">{value}</p>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card title="設備現場即時監控 (Live Feed)" icon={Camera}>
                      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group">
                        <img 
                          src={`https://picsum.photos/seed/asset-cam-${selectedAsset.id}/800/600`} 
                          alt="Asset Live Feed" 
                          className="w-full h-full object-cover opacity-90" 
                        />
                        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-rose-600/90 backdrop-blur-md rounded-full">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest">LIVE • {selectedAsset.name}</span>
                        </div>
                        <div className="absolute bottom-4 right-4 text-white/60 text-[10px] font-mono">
                          {format(new Date(), 'HH:mm:ss')}
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700">
                            <UserRound size={16} />
                          </div>
                          <p className="text-xs font-bold text-emerald-900">當前操作員: 張三</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">安全認證通過</span>
                      </div>
                    </Card>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="asset-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredAssets.map(a => (
                  <motion.div
                    key={a.id}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedAsset(a)}
                    className="cursor-pointer"
                  >
                    <Card className="group hover:border-emerald-400 transition-all border-emerald-100">
                      <div className="aspect-video w-full overflow-hidden rounded-xl mb-4 bg-emerald-50">
                        <img src={a.image} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-lg text-emerald-950 group-hover:text-emerald-600 transition-colors">{a.name}</h4>
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                          a.status === '可用' ? "bg-emerald-100 text-emerald-700" : 
                          a.status === '維修中' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {a.status}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700/60 mb-4 font-bold uppercase tracking-wider">{a.type} • {a.plateNumber}</p>
                      <div className="pt-4 border-t border-emerald-50 flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-emerald-800/40 font-bold flex items-center gap-1">
                            <Calendar size={10} /> 保養: {a.lastMaintenance}
                          </span>
                          <button onClick={(e) => { e.stopPropagation(); openEditModal(a); }} className="text-emerald-500 hover:text-emerald-700 font-bold text-[10px] text-left">修改資料</button>
                        </div>
                        <span className="text-emerald-600 text-xs font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          設備詳情 <ChevronRight size={14} />
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        );

      case 'employees':
        const filteredEmployees = data.employees.filter(e => 
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.field.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <AnimatePresence mode="wait">
            {selectedEmployee ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <button 
                  onClick={() => setSelectedEmployee(null)}
                  className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors mb-4"
                >
                  <ArrowLeft size={20} /> 返回員工列表
                </button>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-1">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden mb-4 border-4 border-emerald-50 shadow-lg rotate-3">
                        <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-2xl font-black text-emerald-950">{selectedEmployee.name}</h3>
                      <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4">{selectedEmployee.role}</p>
                      
                      <div className="w-full space-y-3 pt-6 border-t border-emerald-50">
                        <div className="flex items-center gap-3 text-emerald-800/70 text-sm">
                          <UserRound size={16} className="text-emerald-400" />
                          <span>年齡: {selectedEmployee.age} 歲</span>
                        </div>
                        <div className="flex items-center gap-3 text-emerald-800/70 text-sm">
                          <Briefcase size={16} className="text-emerald-400" />
                          <span>負責領域: {selectedEmployee.field}</span>
                        </div>
                        <div className="flex items-center gap-3 text-emerald-800/70 text-sm">
                          <Phone size={16} className="text-emerald-400" />
                          <span>{selectedEmployee.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-emerald-800/70 text-sm">
                          <Mail size={16} className="text-emerald-400" />
                          <span>{selectedEmployee.email}</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div className="lg:col-span-2 space-y-6">
                    <Card title="個人簡介" icon={UserRound}>
                      <p className="text-emerald-900/80 leading-relaxed">
                        {selectedEmployee.bio}
                      </p>
                    </Card>
                    
                    <Card title="持有證照" icon={Award}>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployee.certs.map((cert, idx) => (
                          <span key={idx} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-bold text-sm">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </Card>

                    <Card title="入職資訊" icon={Calendar}>
                      <div className="flex items-center gap-2 text-emerald-900">
                        <span className="font-bold">入職日期:</span>
                        <span>{selectedEmployee.joinDate}</span>
                      </div>
                    </Card>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredEmployees.map(emp => (
                  <motion.div
                    key={emp.id}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedEmployee(emp)}
                    className="cursor-pointer"
                  >
                    <Card className="group hover:border-emerald-400 transition-all border-emerald-100">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-50 group-hover:rotate-3 transition-transform">
                          <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-black text-xl text-emerald-950">{emp.name}</h4>
                          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{emp.role}</p>
                          <div className="mt-2 flex items-center gap-2 text-[10px] text-emerald-700/60 font-bold">
                            <Briefcase size={10} /> {emp.field}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-emerald-50 flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-emerald-800/40 font-bold">{emp.age} 歲</span>
                          <button onClick={(e) => { e.stopPropagation(); openEditModal(emp); }} className="text-emerald-500 hover:text-emerald-700 font-bold text-[10px] text-left">修改資料</button>
                        </div>
                        <span className="text-emerald-600 text-xs font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          查看詳情 <ChevronRight size={14} />
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        );

      case 'cctv':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.cctvs.map(cam => (
                <Card key={cam.id} title={cam.name} icon={Camera}>
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden group">
                    <img src={cam.streamUrl} alt={cam.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full">
                      <div className={cn("w-2 h-2 rounded-full animate-pulse", cam.status === '在線' ? "bg-emerald-500" : "bg-rose-500")} />
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">{cam.status}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-xs font-bold flex items-center gap-1 opacity-70">
                        <MapPin size={12} /> {cam.location}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'customers':
        const filteredCustomers = data.customers.filter(c => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.taxId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <Card title="客戶管理系統" icon={Users}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-emerald-100">
                    <th className="pb-4 font-semibold text-emerald-800">公司名稱</th>
                    <th className="pb-4 font-semibold text-emerald-800">統一編號</th>
                    <th className="pb-4 font-semibold text-emerald-800">聯絡人</th>
                    <th className="pb-4 font-semibold text-emerald-800">電話</th>
                    <th className="pb-4 font-semibold text-emerald-800">地址</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {filteredCustomers.map(c => (
                    <tr key={c.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-4 font-bold text-emerald-950">{c.name}</td>
                      <td className="py-4 text-emerald-800/70 font-mono">{c.taxId}</td>
                      <td className="py-4 text-emerald-800/70">{c.contactPerson}</td>
                      <td className="py-4 text-emerald-800/70">{c.phone}</td>
                      <td className="py-4 text-emerald-800/70 text-sm">{c.address}</td>
                      <td className="py-4">
                        <button onClick={() => openEditModal(c)} className="text-emerald-600 hover:text-emerald-800 font-bold text-xs">修改</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );

      case 'waste':
        const filteredWaste = data.wasteLogs.filter(w => 
          w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.region.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <Card title="化學廢棄物追蹤" icon={Trash2}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-emerald-100">
                    <th className="pb-4 font-semibold text-emerald-800">化學品名稱</th>
                    <th className="pb-4 font-semibold text-emerald-800">來源地區</th>
                    <th className="pb-4 font-semibold text-emerald-800">處理量 (kg)</th>
                    <th className="pb-4 font-semibold text-emerald-800">當地溫度 (°C)</th>
                    <th className="pb-4 font-semibold text-emerald-800">揮發溫度 (°C)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {filteredWaste.map((w, i) => (
                    <tr key={w.id || i} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-4 font-bold text-emerald-950 flex items-center gap-2">
                        <Droplets size={16} className="text-emerald-500" /> {w.name}
                      </td>
                      <td className="py-4 text-emerald-800/70">{w.region}</td>
                      <td className="py-4 font-mono font-bold text-emerald-600">{w.amount.toLocaleString()}</td>
                      <td className="py-4 text-emerald-800/70">
                        <span className="flex items-center gap-1"><Thermometer size={14} /> {w.temp}°</span>
                      </td>
                      <td className="py-4 text-emerald-800/70 font-bold text-rose-600">{w.volTemp}°C</td>
                      <td className="py-4">
                        <button onClick={() => openEditModal(w)} className="text-emerald-600 hover:text-emerald-800 font-bold text-xs">修改</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );

      case 'voc':
        const filteredEngineering = data.vocEngineering.filter(item => 
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.plant.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tank.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const groupedEngineering = filteredEngineering.reduce((acc, item) => {
          if (!acc[item.content]) acc[item.content] = [];
          acc[item.content].push(item);
          return acc;
        }, {} as Record<string, VocEngineeringData[]>);

        return (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="VOCs 回收趨勢 (24H)" icon={Wind}>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { time: '00:00', val: 45 }, { time: '04:00', val: 30 }, { time: '08:00', val: 85 },
                      { time: '12:00', val: 120 }, { time: '16:00', val: 95 }, { time: '20:00', val: 60 }
                    ]}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#065f46', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#065f46', fontSize: 12}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="台灣各縣市 VOCs 含量分佈" icon={PieChart}>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.vocRegions}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="amount"
                        nameKey="region"
                        label={({ region, percent }) => `${region} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.vocRegions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <Activity size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-emerald-950 tracking-tight">VOC 工程歷史資料庫</h2>
                  <p className="text-sm text-emerald-600 font-medium">依內容物分類之工程紀錄與分析</p>
                </div>
              </div>

              {Object.entries(groupedEngineering).map(([content, logs]: [string, VocEngineeringData[]]) => (
                <Card key={content} title={`${content} - 工程歷史`} icon={Droplets} className="border-emerald-200 shadow-md">
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">總工程次數</p>
                      <p className="text-2xl font-black text-emerald-950">{logs.length} <span className="text-sm font-normal text-emerald-600">次</span></p>
                    </div>
                    <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
                      <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1">累計容量</p>
                      <p className="text-2xl font-black text-emerald-950">{logs.reduce((s, l) => s + l.capacity, 0).toLocaleString()} <span className="text-sm font-normal text-teal-600">KL</span></p>
                    </div>
                    <div className="p-4 bg-lime-50 rounded-2xl border border-lime-100">
                      <p className="text-[10px] font-bold text-lime-600 uppercase tracking-widest mb-1">主要客戶</p>
                      <p className="text-lg font-black text-emerald-950 truncate">{logs[0].customer}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                      <thead>
                        <tr className="text-emerald-800/50 text-[10px] font-black uppercase tracking-widest">
                          <th className="px-4 py-2">日期</th>
                          <th className="px-4 py-2">客戶</th>
                          <th className="px-4 py-2">廠區</th>
                          <th className="px-4 py-2">儲槽</th>
                          <th className="px-4 py-2 text-right">容量 (KL)</th>
                          <th className="px-4 py-2">型式</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((log) => (
                          <tr key={log.id} className="bg-white hover:bg-emerald-50/50 transition-all group shadow-sm">
                            <td className="px-4 py-3 first:rounded-l-xl border-y border-l border-emerald-50 group-hover:border-emerald-200">
                              <span className="text-xs font-mono font-bold text-emerald-600">{log.date}</span>
                            </td>
                            <td className="px-4 py-3 border-y border-emerald-50 group-hover:border-emerald-200">
                              <span className="text-sm font-bold text-emerald-950">{log.customer}</span>
                            </td>
                            <td className="px-4 py-3 border-y border-emerald-50 group-hover:border-emerald-200">
                              <span className="text-xs text-emerald-700 font-medium">{log.plant}</span>
                            </td>
                            <td className="px-4 py-3 border-y border-emerald-50 group-hover:border-emerald-200">
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black">
                                {log.tank}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-y border-emerald-50 group-hover:border-emerald-200 text-right">
                              <span className="text-sm font-black text-emerald-900">{log.capacity.toLocaleString()}</span>
                            </td>
                            <td className="px-4 py-3 last:rounded-r-xl border-y border-r border-emerald-50 group-hover:border-emerald-200">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-500">{log.type}</span>
                                <button onClick={() => openEditModal(log)} className="text-emerald-400 hover:text-emerald-600 font-bold text-[10px]">修改</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'pos':
        const filteredInvoices = data.invoices.filter(i => 
          i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.customerName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <Card title="發票與收款系統" icon={Receipt}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-emerald-100">
                    <th className="pb-4 font-semibold text-emerald-800">發票號碼</th>
                    <th className="pb-4 font-semibold text-emerald-800">客戶名稱</th>
                    <th className="pb-4 font-semibold text-emerald-800">金額</th>
                    <th className="pb-4 font-semibold text-emerald-800">日期</th>
                    <th className="pb-4 font-semibold text-emerald-800">狀態</th>
                    <th className="pb-4 font-semibold text-emerald-800">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-4 font-mono font-bold text-emerald-950">{inv.invoiceNumber}</td>
                      <td className="py-4 text-emerald-800/70">{inv.customerName}</td>
                      <td className="py-4 font-bold text-emerald-600">${inv.amount.toLocaleString()}</td>
                      <td className="py-4 text-emerald-800/70">{inv.date}</td>
                      <td className="py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold",
                          inv.status === '已付款' ? "bg-emerald-100 text-emerald-700" : 
                          inv.status === '未付款' ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                        )}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button onClick={() => openEditModal(inv)} className="text-emerald-600 hover:text-emerald-800 font-bold text-xs">修改</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );

      case 'field-app':
        return (
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-emerald-900 text-white p-8 rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-emerald-800">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full -mr-24 -mt-24 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-lime-500/10 rounded-full -ml-16 -mb-16 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Leaf className="text-lime-400" size={20} />
                  <p className="text-lime-400 text-xs font-bold tracking-widest uppercase">Field Assistant</p>
                </div>
                <h2 className="text-3xl font-bold mb-2">大宜昌有限公司</h2>
                <div className="flex items-center gap-2 text-emerald-200/60 text-sm">
                  <MapPin size={14} /> 雲林縣麥寮鄉台塑六輕
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-emerald-50 shadow-sm hover:border-emerald-500 transition-all group">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Camera size={28} />
                </div>
                <span className="font-bold text-emerald-900">拍照上傳</span>
              </button>
              <button className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-emerald-50 shadow-sm hover:border-emerald-500 transition-all group">
                <div className="p-4 bg-lime-50 text-lime-600 rounded-2xl mb-3 group-hover:bg-lime-600 group-hover:text-white transition-colors">
                  <MapPin size={28} />
                </div>
                <span className="font-bold text-emerald-900">GPS 簽到</span>
              </button>
            </div>

            <Card title="今日任務" icon={Briefcase}>
              <div className="space-y-4">
                <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-bold text-emerald-950">油槽清洗 A-05</h5>
                      <p className="text-xs text-emerald-700/60">台塑六輕 • 第三廠區</p>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full uppercase tracking-wider">進行中</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-emerald-800">施工進度</p>
                    <p className="text-xs font-bold text-emerald-600">65%</p>
                  </div>
                  <div className="w-full bg-emerald-100 h-2.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      className="bg-emerald-600 h-full rounded-full" 
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card title="現場設備與人員監控" icon={Camera}>
              <div className="space-y-4">
                <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-inner group">
                  <img 
                    src="https://picsum.photos/seed/site-worker/800/600" 
                    alt="Site Monitoring" 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-rose-600/80 backdrop-blur-md rounded-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">REC LIVE</span>
                  </div>
                  <div className="absolute bottom-3 right-3 text-white/80 text-[10px] font-mono bg-black/40 px-2 py-1 rounded">
                    CAM-FIELD-01 • {format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                  </div>
                  <div className="absolute inset-0 border-2 border-white/10 pointer-events-none rounded-2xl" />
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700">
                      <UserRound size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-900">目前作業人員</p>
                      <p className="text-[10px] text-emerald-600 font-medium">張三、李四 (施工中)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-tighter">設備狀態</p>
                    <p className="text-[10px] text-emerald-600 font-black">運轉中 (100%)</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-emerald-900/20">
            <AlertCircle size={64} className="mb-4" />
            <p className="text-xl font-bold">此模組正在開發中...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex font-sans text-emerald-950 selection:bg-emerald-200 selection:text-emerald-900">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-emerald-50 transition-all duration-300 lg:relative",
        !isSidebarOpen ? "-translate-x-full lg:w-0 lg:opacity-0 lg:border-none" : "translate-x-0 lg:w-72 lg:opacity-100"
      )}>
        <div className={cn("p-8 h-full flex flex-col transition-opacity duration-200", !isSidebarOpen && "lg:opacity-0")}>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 rotate-3">
                <Leaf size={28} />
              </div>
              <div>
                <h1 className="font-black text-2xl tracking-tight text-emerald-950">大宜昌</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-black">Environmental</p>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-emerald-800 hover:bg-emerald-50 rounded-xl"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1.5 flex-1">
            <SidebarItem icon={LayoutDashboard} label="儀表板" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={Camera} label="公司監視器" active={activeTab === 'cctv'} onClick={() => setActiveTab('cctv')} />
            <SidebarItem icon={Users} label="客戶管理" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
            <SidebarItem icon={Briefcase} label="工程案件" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
            <SidebarItem icon={Truck} label="設備資產" active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} />
            <SidebarItem icon={Trash2} label="廢棄物追蹤" active={activeTab === 'waste'} onClick={() => setActiveTab('waste')} />
            <SidebarItem icon={Wind} label="VOC 數據" active={activeTab === 'voc'} onClick={() => setActiveTab('voc')} />
            <SidebarItem icon={UserRound} label="員工派遣" active={activeTab === 'employees'} onClick={() => setActiveTab('employees')} />
            <SidebarItem icon={Receipt} label="發票收款" active={activeTab === 'pos'} onClick={() => setActiveTab('pos')} />
          </nav>

          <div className="mt-auto pt-8 border-t border-emerald-50">
            <div className="p-4 bg-emerald-50 rounded-2xl mb-4">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">工地現場模式</p>
              <button 
                onClick={() => setActiveTab('field-app')}
                className="w-full py-3 bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
              >
                <Camera size={16} /> 開啟助手
              </button>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="w-full py-2 text-emerald-400 hover:text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
            >
              <PanelLeftClose size={14} /> 隱藏側邊選單
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-24 bg-white/50 backdrop-blur-md border-b border-emerald-50 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-all active:scale-95 shadow-sm"
            >
              {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
              <span className="font-bold text-sm hidden sm:block">{isSidebarOpen ? '隱藏選單' : '顯示選單'}</span>
            </button>
            <div>
              <h2 className="text-2xl font-black text-emerald-950 tracking-tight">
                {activeTab === 'dashboard' && '儀表板概覽'}
                {activeTab === 'cctv' && '公司監視系統 (CCTV)'}
                {activeTab === 'customers' && '客戶管理系統'}
                {activeTab === 'projects' && '工程案件中心'}
                {activeTab === 'assets' && (selectedAsset ? `設備詳情: ${selectedAsset.name}` : '設備資產管理')}
                {activeTab === 'waste' && '化學廢棄物追蹤'}
                {activeTab === 'employees' && (selectedEmployee ? `員工詳情: ${selectedEmployee.name}` : '員工派遣管理')}
                {activeTab === 'field-app' && '工地現場助手'}
              </h2>
              <p className="text-xs font-medium text-emerald-600/60">大宜昌有限公司 • 管理後台</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {['customers', 'projects', 'assets', 'employees', 'voc', 'waste', 'pos'].includes(activeTab) && (
              <button 
                onClick={() => { setFormData({}); setIsEditMode(false); setIsAddModalOpen(true); }}
                className="flex items-center gap-2 bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-800 transition-all hover:scale-105 active:scale-95"
              >
                <Plus size={18} /> 新增資料
              </button>
            )}
            <div className="hidden md:flex items-center gap-3 bg-emerald-50/50 px-5 py-3 rounded-2xl border border-emerald-100/50 focus-within:border-emerald-400 transition-all">
              <Search size={18} className="text-emerald-400" />
              <input 
                type="text" 
                placeholder="搜尋案件、員工、內容物..." 
                className="bg-transparent border-none outline-none text-sm w-64 text-emerald-950 placeholder:text-emerald-300" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-emerald-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-emerald-950">管理員</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">系統架構師</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-white shadow-sm overflow-hidden rotate-2">
                <img src="https://picsum.photos/seed/admin/100/100" alt="Avatar" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (selectedEmployee?.id || '') + (selectedAsset?.id || '') + (selectedCCTV?.id || '')}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      {renderAddModal()}
    </div>
  );
}
