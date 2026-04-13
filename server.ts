import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory database for demo purposes (since Firebase was declined)
  const db = {
    customers: [
      { id: "1", name: "台塑六輕", taxId: "12345678", address: "雲林縣麥寮鄉", contactPerson: "王大明", phone: "0912-345-678" },
      { id: "2", name: "中油公司", taxId: "87654321", address: "高雄市楠梓區", contactPerson: "李小華", phone: "0922-111-222" }
    ],
    projects: [
      { id: "1", customerId: "1", customerName: "台塑六輕", title: "六輕油槽清洗工程", type: "工業設備清洗", status: "施工中", contractAmount: 500000, startDate: "2026-04-01", endDate: "2026-04-15" },
      { id: "2", customerId: "2", customerName: "中油公司", title: "廢棄物清運合約", type: "廢棄物清除", status: "已完工", contractAmount: 120000, startDate: "2026-03-10", endDate: "2026-03-20" },
      { id: "3", customerId: "1", customerName: "台塑六輕", title: "VOC 回收系統安裝", type: "VOC回收工程", status: "報價中", contractAmount: 2500000, startDate: "2026-04-05", endDate: "2026-06-30" }
    ],
    assets: [
      { 
        id: "1", 
        name: "真空抽油車 A-01", 
        plateNumber: "ABC-1234", 
        type: "抽油車", 
        status: "施工中",
        description: "高功率真空抽吸系統，專為大型油槽底泥清除設計，具備防爆認證。",
        lastMaintenance: "2026-02-15",
        specs: { "抽吸量": "500L/min", "槽體容量": "10,000L", "最大壓力": "15 bar" },
        image: "https://picsum.photos/seed/truck1/400/300"
      },
      { 
        id: "2", 
        name: "移動式污泥脫水機 B-05", 
        plateNumber: "N/A", 
        type: "脫水機", 
        status: "可用",
        description: "全自動離心式脫水設備，可大幅降低污泥含水率，節省後端處理成本。",
        lastMaintenance: "2026-03-01",
        specs: { "處理量": "5m³/hr", "動力": "30kW", "脫水率": "75-85%" },
        image: "https://picsum.photos/seed/machine1/400/300"
      },
      { 
        id: "3", 
        name: "高壓水刀清洗機 C-12", 
        plateNumber: "N/A", 
        type: "清洗設備", 
        status: "維修中",
        description: "超高壓水刀系統，能有效去除硬化結垢與化學殘留物。",
        lastMaintenance: "2026-04-01",
        specs: { "工作壓力": "2500 bar", "流量": "25L/min", "噴頭數": "4" },
        image: "https://picsum.photos/seed/washer1/400/300"
      }
    ],
    vocRegionData: [
      { region: "雲林縣", vocType: "苯", amount: 450 },
      { region: "高雄市", vocType: "甲苯", amount: 800 },
      { region: "桃園市", vocType: "二甲苯", amount: 300 },
      { region: "台中市", vocType: "乙苯", amount: 200 },
      { region: "新北市", vocType: "其他", amount: 150 }
    ],
    employees: [
      { 
        id: "1", 
        name: "張三", 
        age: 42, 
        role: "工地主任", 
        field: "工業設備清洗", 
        avatar: "https://picsum.photos/seed/emp1/200/200",
        phone: "0912-000-111",
        email: "zhang@dajichang.com",
        joinDate: "2018-05-20",
        certs: ["工安證", "大貨車駕照", "急救人員證"],
        bio: "擁有超過 15 年的工業清洗經驗，曾主導多次大型油槽清洗專案，對現場安全管控極為嚴謹。"
      },
      { 
        id: "2", 
        name: "李四", 
        age: 29, 
        role: "技術員", 
        field: "VOC 回收工程", 
        avatar: "https://picsum.photos/seed/emp2/200/200",
        phone: "0922-333-444",
        email: "li@dajichang.com",
        joinDate: "2021-11-10",
        certs: ["堆高機證", "特定化學物質作業主管"],
        bio: "專精於 VOC 回收設備的安裝與調試，對自動化監測系統有深入研究。"
      },
      { 
        id: "3", 
        name: "王五", 
        age: 35, 
        role: "工程師", 
        field: "污泥處理", 
        avatar: "https://picsum.photos/seed/emp3/200/200",
        phone: "0933-555-666",
        email: "wang@dajichang.com",
        joinDate: "2019-03-15",
        certs: ["廢棄物處理技術員", "甲級環保證照"],
        bio: "負責污泥脫水設備的研發與優化，致力於提升處理效率並降低環境衝擊。"
      }
    ],
    cctv: [
      { id: "1", name: "大門入口", location: "辦公室大門", status: "在線", streamUrl: "https://picsum.photos/seed/cctv1/800/600" },
      { id: "2", name: "設備停車場", location: "後院車庫", status: "在線", streamUrl: "https://picsum.photos/seed/cctv2/800/600" },
      { id: "3", name: "廢棄物暫存區", location: "廠區B區", status: "在線", streamUrl: "https://picsum.photos/seed/cctv3/800/600" },
      { id: "4", name: "VOC回收塔", location: "頂樓平台", status: "離線", streamUrl: "https://picsum.photos/seed/cctv4/800/600" }
    ],
    vocLogs: [
      // ... (existing vocLogs)
    ],
    vocEngineering: [
      { id: "v1", customer: "台塑石化", plant: "烯烴一廠", tank: "T-056A", date: "2012-08-15", content: "九碳餾份油", capacity: 2000, type: "內浮頂" },
      { id: "v2", customer: "台塑石化", plant: "彰濱廠", tank: "T-M601", date: "2013-04-27", content: "無鉛汽油", capacity: 1000, type: "內浮頂" },
      { id: "v3", customer: "台塑石化", plant: "彰濱廠", tank: "T-M603", date: "2013-04-27", content: "無鉛汽油", capacity: 1000, type: "內浮頂" },
      { id: "v4", customer: "台塑石化", plant: "彰濱廠", tank: "T-M602", date: "2013-04-28", content: "無鉛汽油", capacity: 1000, type: "內浮頂" },
      { id: "v5", customer: "台灣塑膠", plant: "保三廠", tank: "T-502B", date: "2015-04-21", content: "有機廢液", capacity: 1021, type: "固定頂" },
      { id: "v6", customer: "台塑石化", plant: "烯烴二廠", tank: "T-805B", date: "2016-04-12", content: "DMF", capacity: 713, type: "固定頂" },
      { id: "v7", customer: "台塑石化", plant: "烯烴二廠", tank: "T-805", date: "2016-04-14", content: "DMF", capacity: 325, type: "固定頂" },
      { id: "v8", customer: "台灣化學", plant: "芳香烴二廠", tank: "T-703C", date: "2016-07-05", content: "鄰二甲苯", capacity: 500, type: "內浮頂" },
      { id: "v9", customer: "台灣化學", plant: "PTA廠", tank: "T-910", date: "2016-10-17", content: "醋酸", capacity: 5000, type: "固定頂" },
      { id: "v10", customer: "台灣化學", plant: "芳香烴二廠", tank: "T-703B", date: "2016-11-29", content: "鄰二甲苯", capacity: 500, type: "內浮頂" },
      { id: "v11", customer: "台灣化學", plant: "PTA廠", tank: "T-900D", date: "2016-12-19", content: "對二甲苯", capacity: 20000, type: "固定頂" },
      { id: "v12", customer: "台灣化學", plant: "芳香烴三廠", tank: "3T-408", date: "2017-01-16", content: "碸烷", capacity: 500, type: "內浮頂" },
      { id: "v13", customer: "台灣化學", plant: "芳香烴二廠", tank: "T-703A", date: "2017-02-09", content: "鄰二甲苯", capacity: 500, type: "內浮頂" },
      { id: "v14", customer: "台灣化學", plant: "芳香烴二廠", tank: "T-641", date: "2017-03-02", content: "甲苯", capacity: 20000, type: "內浮頂" },
      { id: "v15", customer: "台灣化學", plant: "芳香烴二廠", tank: "T-901", date: "2017-04-26", content: "對二甲苯", capacity: 20000, type: "內浮頂" },
      { id: "v16", customer: "台灣塑膠", plant: "保三廠", tank: "T-658", date: "2017-05-02", content: "冷卻水", capacity: 200, type: "固定頂" },
      { id: "v17", customer: "台塑石化", plant: "烯烴一廠", tank: "T-056B", date: "2017-06-21", content: "九碳餾份油", capacity: 2353, type: "內浮頂" },
      { id: "v18", customer: "台灣化學", plant: "芳香烴二廠", tank: "T-501B", date: "2017-07-05", content: "芳香烴油", capacity: 20000, type: "內浮頂" },
      { id: "v19", customer: "台灣化學", plant: "合成酚廠", tank: "T-171", date: "2017-11-28", content: "廢異丙苯", capacity: 3000, type: "內浮頂" },
      { id: "v20", customer: "台塑石化", plant: "烯烴一廠", tank: "T-015A", date: "2018-01-03", content: "輕製氣油", capacity: 5639, type: "內浮頂" },
      { id: "v21", customer: "台灣化學", plant: "合成酚廠", tank: "T-101B", date: "2018-03-20", content: "苯", capacity: 5000, type: "內浮頂" },
      { id: "v22", customer: "台灣塑膠", plant: "保二廠", tank: "T-532", date: "2018-03-26", content: "丙烯酸", capacity: 200, type: "固定頂" },
      { id: "v23", customer: "台灣化學", plant: "合成酚廠", tank: "T-181B", date: "2018-04-16", content: "異丙苯", capacity: 10000, type: "內浮頂" },
      { id: "v24", customer: "台塑石化", plant: "烯烴三廠", tank: "T-054", date: "2018-04-27", content: "回收油", capacity: 2000, type: "內浮頂" },
      { id: "v25", customer: "台灣化學", plant: "芳香烴廠", tank: "T-85", date: "2018-07-13", content: "重芳香烴油", capacity: 1000, type: "固定頂" },
      { id: "v26", customer: "台灣化學", plant: "芳香烴廠", tank: "T-705", date: "2018-09-17", content: "鄰二甲苯", capacity: 20000, type: "內浮頂" },
      { id: "v27", customer: "台灣塑膠", plant: "保三廠", tank: "T-502A", date: "2018-10-31", content: "有機廢液", capacity: 1000, type: "固定頂" },
      { id: "v28", customer: "台灣化學", plant: "芳香烴廠", tank: "T-903A", date: "2018-11-20", content: "對二甲苯", capacity: 3000, type: "內浮頂" },
      { id: "v29", customer: "台灣化學", plant: "芳香烴廠", tank: "T-901B", date: "2018-12-05", content: "對二甲苯", capacity: 10000, type: "內浮頂" },
      { id: "v30", customer: "台灣塑膠", plant: "VCM廠", tank: "NT-402", date: "2019-02-12", content: "二氯乙烷", capacity: 7000, type: "固定頂" },
      { id: "v31", customer: "台灣化學", plant: "芳香烴廠", tank: "T-605", date: "2019-04-29", content: "苯", capacity: 20000, type: "內浮頂" },
      { id: "v32", customer: "南亞塑膠", plant: "異辛醇廠", tank: "T-661A", date: "2019-07-25", content: "丁醛", capacity: 2000, type: "內浮頂" },
      { id: "v33", customer: "台灣苯乙烯", plant: "高雄廠", tank: "MT-314", date: "2019-10-14", content: "對二甲苯", capacity: 4000, type: "固定頂" },
      { id: "v34", customer: "台灣化學", plant: "芳香烴廠", tank: "3T-510", date: "2020-03-03", content: "裂解汽油", capacity: 10000, type: "內浮頂" },
      { id: "v35", customer: "台灣化學", plant: "芳香烴廠", tank: "3T-901A", date: "2020-05-14", content: "對二甲苯", capacity: 50000, type: "內浮頂" },
      { id: "v36", customer: "南亞塑膠", plant: "異辛醇廠", tank: "T-662B", date: "2020-07-15", content: "異丁醇", capacity: 1000, type: "固定頂" },
      { id: "v37", customer: "台灣塑膠", plant: "AN廠", tank: "T-251A", date: "2020-11-30", content: "丙烯腈", capacity: 1000, type: "內浮頂" },
      { id: "v38", customer: "台灣塑膠", plant: "VCM廠", tank: "NT-707", date: "2021-02-26", content: "二氯乙烷", capacity: 15000, type: "固定頂" },
      { id: "v39", customer: "台灣塑膠", plant: "EVA廠", tank: "T-641", date: "2022-06-13", content: "醋酸乙烯酯", capacity: 3000, type: "固定頂" },
      { id: "v40", customer: "台塑石化", plant: "烯烴一廠", tank: "T-010B", date: "2022-06-29", content: "石腦油", capacity: 10000, type: "內浮頂" },
      { id: "v41", customer: "台塑石化", plant: "烯烴二廠", tank: "T-055", date: "2023-02-08", content: "沖洗油", capacity: 3000, type: "內浮頂" },
      { id: "v42", customer: "台塑石化", plant: "彰濱廠", tank: "T-M601", date: "2023-05-25", content: "無鉛汽油", capacity: 1000, type: "內浮頂" },
      { id: "v43", customer: "台塑石化", plant: "烯烴二廠", tank: "T-051", date: "2023-06-14", content: "粗裂解汽油", capacity: 20000, type: "內浮頂" },
      { id: "v44", customer: "台灣塑膠", plant: "AE廠", tank: "T-577A", date: "2023-07-21", content: "丙烯酸", capacity: 5000, type: "固定頂" },
      { id: "v45", customer: "台塑石化", plant: "烯烴一廠", tank: "T-010A", date: "2024-01-08", content: "石腦油", capacity: 10000, type: "內浮頂" },
      { id: "v46", customer: "台灣中油", plant: "煉製事業部", tank: "D-312", date: "2024-04-07", content: "95汽油", capacity: 34000, type: "內浮頂" },
      { id: "v47", customer: "台灣中油", plant: "煉製事業部", tank: "LY-109", date: "2024-04-15", content: "混二甲苯", capacity: 15000, type: "內浮頂" },
      { id: "v48", customer: "台灣中油", plant: "煉製事業部", tank: "WT-318", date: "2024-04-28", content: "98汽油", capacity: 6000, type: "掩體式" }
    ],
    wasteLogs: [
      { id: "w1", name: '廢油泥', region: '雲林麥寮', amount: 5000, temp: 28, volTemp: 180 },
      { id: "w2", name: '廢溶劑', region: '高雄楠梓', amount: 1200, temp: 31, volTemp: 85 },
      { id: "w3", name: '重金屬污泥', region: '桃園中壢', amount: 3500, temp: 25, volTemp: 450 },
    ],
    invoices: [
      { id: "inv1", invoiceNumber: "INV-2024-001", customerName: "台塑石化", amount: 250000, date: "2024-03-15", status: "已付款" },
      { id: "inv2", invoiceNumber: "INV-2024-002", customerName: "台灣化學", amount: 120000, date: "2024-03-20", status: "未付款" },
      { id: "inv3", invoiceNumber: "INV-2024-003", customerName: "南亞塑膠", amount: 85000, date: "2024-04-01", status: "已付款" },
    ]
  };

  // API Routes
  app.get("/api/dashboard", (req, res) => {
    res.json({
      activeProjects: db.projects.filter(p => p.status === "施工中").length,
      totalCustomers: db.customers.length,
      availableAssets: db.assets.filter(a => a.status === "可用").length,
      recentVoc: [
        { timestamp: new Date().toISOString(), recoveryVolume: 120 },
        { timestamp: new Date(Date.now() - 3600000).toISOString(), recoveryVolume: 135 }
      ]
    });
  });

  app.get("/api/customers", (req, res) => res.json(db.customers));
  app.get("/api/projects", (req, res) => res.json(db.projects));
  app.get("/api/assets", (req, res) => res.json(db.assets));
  app.get("/api/employees", (req, res) => res.json(db.employees));
  app.get("/api/voc-regions", (req, res) => res.json(db.vocRegionData));
  app.get("/api/cctv", (req, res) => res.json(db.cctv));
  app.get("/api/voc-logs", (req, res) => res.json(db.vocLogs));
  app.get("/api/voc-engineering", (req, res) => res.json(db.vocEngineering));
  app.get("/api/waste-logs", (req, res) => res.json(db.wasteLogs));
  app.get("/api/invoices", (req, res) => res.json(db.invoices));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
