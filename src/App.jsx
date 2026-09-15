import { useState, useRef, useEffect } from "react";
import Login from "./Login";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`;

const ISSUES = [
  { id: "pothole", label: "Potholes / Road damage", icon: "⚠", dept: "Public Works Department", color: "#FF6B35" },
  { id: "streetlight", label: "Streetlight failure", icon: "💡", dept: "Electricity Board", color: "#FFB800" },
  { id: "power", label: "Power outage", icon: "⚡", dept: "Electricity Board", color: "#FFB800" },
  { id: "transport", label: "Poor public transport", icon: "🚌", dept: "Transport Corporation", color: "#00C9A7" },
  { id: "garbage", label: "Garbage / Waste accumulation", icon: "🗑", dept: "Sanitation Department", color: "#6BCB77" },
  { id: "waterleakage", label: "Water pipe leakage", icon: "💧", dept: "Water & Sewerage Board", color: "#4D9DE0" },
  { id: "watershortage", label: "Drinking water shortage", icon: "🚰", dept: "Water & Sewerage Board", color: "#4D9DE0" },
  { id: "sewage", label: "Sewage overflow", icon: "🔴", dept: "Sanitation Department", color: "#E84855" },
  { id: "dumping", label: "Illegal waste dumping", icon: "🏗", dept: "Municipal Corporation", color: "#9B5DE5" },
  { id: "traffic", label: "Traffic / Signal issue", icon: "🚦", dept: "Traffic Police / Roads", color: "#F15BB5" },
  { id: "infrastructure", label: "Broken public infrastructure", icon: "🏚", dept: "Public Works Department", color: "#FF6B35" },
  { id: "flooding", label: "Flooding / Drainage issue", icon: "🌊", dept: "Drainage & Irrigation Board", color: "#4D9DE0" },
  { id: "stray", label: "Stray animal problem", icon: "🐕", dept: "Municipal Animal Control", color: "#00C9A7" },
];

const SAMPLE_REPORTS = [
  { id: "CR-2024-001", issue: "Potholes / Road damage", location: "Gandhi Nagar, Main Road", status: "resolved", date: "2 days ago", authority: "Public Works Department", estimatedDays: 3 },
  { id: "CR-2024-002", issue: "Garbage / Waste accumulation", location: "Market Street, Block 4", status: "in_progress", date: "5 days ago", authority: "Sanitation Department", estimatedDays: 1 },
  { id: "CR-2024-003", issue: "Streetlight failure", location: "Anna Salai, Near Bus Stop", status: "pending", date: "1 week ago", authority: "Electricity Board", estimatedDays: 2 },
];

const STATUS_META = {
  pending: { label: "Pending", color: "#FFB800", bg: "rgba(255,184,0,0.12)" },
  in_progress: { label: "In Progress", color: "#4D9DE0", bg: "rgba(77,157,224,0.12)" },
  resolved: { label: "Resolved", color: "#6BCB77", bg: "rgba(107,203,119,0.12)" },
};

const css = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080D1A;
    --bg2: #0D1525;
    --bg3: #111C2E;
    --card: #0F1A2E;
    --border: rgba(255,255,255,0.08);
    --accent: #FF6B35;
    --accent2: #00C9A7;
    --text: #E8EBF4;
    --muted: #6B7794;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  .app { min-height: 100vh; background: var(--bg); position: relative; overflow: hidden; }
  .noise { position: fixed; inset: 0; pointer-events: none; opacity: 0.025; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  .glow { position: fixed; width: 600px; height: 600px; border-radius: 50%; pointer-events: none; z-index: 0;
    background: radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%);
    top: -200px; right: -200px;
  }
  .glow2 { position: fixed; width: 500px; height: 500px; border-radius: 50%; pointer-events: none; z-index: 0;
    background: radial-gradient(circle, rgba(0,201,167,0.05) 0%, transparent 70%);
    bottom: -150px; left: -100px;
  }

  /* NAV */
  .nav { position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between;
    padding: 18px 28px; border-bottom: 1px solid var(--border); background: rgba(8,13,26,0.8); backdrop-filter: blur(12px);
  }
  .nav-brand { font-family: var(--font-head); font-size: 18px; font-weight: 800; letter-spacing: -0.5px; display: flex; align-items: center; gap: 10px; }
  .nav-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 12px var(--accent); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }
  .nav-tabs { display: flex; gap: 4px; }
  .nav-tab { padding: 8px 16px; border-radius: 8px; border: none; background: transparent; color: var(--muted);
    font-family: var(--font-body); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px;
  }
  .nav-tab:hover { color: var(--text); background: var(--bg3); }
  .nav-tab.active { color: var(--accent); background: rgba(255,107,53,0.1); }

  /* PAGE WRAPPER */
  .page { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; padding: 40px 24px 80px; }

  /* HERO */
  .hero { text-align: center; padding: 60px 0 48px; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 20px;
    background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.25); color: var(--accent);
    font-size: 12px; font-weight: 500; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 24px;
  }
  .hero-title { font-family: var(--font-head); font-size: clamp(38px, 6vw, 64px); font-weight: 800; line-height: 1.05;
    letter-spacing: -2px; margin-bottom: 16px;
  }
  .hero-title span { color: var(--accent); }
  .hero-sub { color: var(--muted); font-size: 16px; font-weight: 300; line-height: 1.6; max-width: 480px; margin: 0 auto 36px; }
  .btn-primary { padding: 14px 32px; background: var(--accent); color: white; border: none; border-radius: 10px;
    font-family: var(--font-body); font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s;
    box-shadow: 0 0 24px rgba(255,107,53,0.3);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 36px rgba(255,107,53,0.45); }
  .btn-secondary { padding: 14px 32px; background: var(--bg3); color: var(--text); border: 1px solid var(--border);
    border-radius: 10px; font-family: var(--font-body); font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); }

  /* STATS BAR */
  .stats-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 48px; }
  .stat-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; }
  .stat-num { font-family: var(--font-head); font-size: 32px; font-weight: 800; color: var(--accent); letter-spacing: -1px; }
  .stat-label { font-size: 12px; color: var(--muted); margin-top: 4px; letter-spacing: 0.3px; }

  /* CATEGORY GRID */
  .section-label { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
  .category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; margin-bottom: 40px; }
  .cat-card { background: var(--card); border: 1.5px solid var(--border); border-radius: 12px; padding: 16px;
    cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;
  }
  .cat-card:hover { border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }
  .cat-card.selected { border-color: var(--sel-color, var(--accent)); background: rgba(255,107,53,0.06); }
  .cat-card.selected::before { content: '✓'; position: absolute; top: 10px; right: 12px; font-size: 11px;
    color: var(--sel-color, var(--accent)); font-weight: 700;
  }
  .cat-icon { font-size: 22px; margin-bottom: 8px; }
  .cat-name { font-size: 12px; font-weight: 500; line-height: 1.4; color: var(--text); }

  /* FORM */
  .form-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; margin-bottom: 20px; }
  .form-card h3 { font-family: var(--font-head); font-size: 18px; font-weight: 700; margin-bottom: 24px; }
  .field { margin-bottom: 20px; }
  .field label { display: block; font-size: 12px; font-weight: 500; color: var(--muted); letter-spacing: 0.5px;
    text-transform: uppercase; margin-bottom: 8px;
  }
  .field input, .field textarea, .field select {
    width: 100%; background: var(--bg2); border: 1px solid var(--border); border-radius: 10px;
    color: var(--text); font-family: var(--font-body); font-size: 14px; padding: 12px 16px;
    outline: none; transition: border 0.2s; resize: none;
  }
  .field input:focus, .field textarea:focus, .field select:focus { border-color: rgba(255,107,53,0.5); }
  .field select option { background: #0D1525; }
  .field textarea { height: 100px; }

  /* UPLOAD ZONE */
  .upload-zone { border: 1.5px dashed var(--border); border-radius: 12px; padding: 36px; text-align: center;
    cursor: pointer; transition: all 0.2s; position: relative;
  }
  .upload-zone:hover { border-color: rgba(255,107,53,0.4); background: rgba(255,107,53,0.03); }
  .upload-icon { font-size: 32px; margin-bottom: 10px; }
  .upload-text { font-size: 14px; color: var(--muted); }
  .upload-text span { color: var(--accent); }
  .upload-preview { width: 100%; height: 160px; object-fit: cover; border-radius: 10px; margin-top: 12px; }
  .upload-zone input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

  /* LOCATION ROW */
  .loc-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: end; }
  .loc-btn { padding: 12px 16px; background: var(--bg3); border: 1px solid var(--border); border-radius: 10px;
    color: var(--text); font-size: 13px; cursor: pointer; white-space: nowrap; transition: all 0.2s;
  }
  .loc-btn:hover { border-color: rgba(0,201,167,0.5); color: var(--accent2); }
  .loc-detected { font-size: 12px; color: var(--accent2); margin-top: 6px; display: flex; align-items: center; gap: 6px; }

  /* PROCESSING */
  .processing { text-align: center; padding: 80px 40px; }
  .spinner-ring { width: 60px; height: 60px; margin: 0 auto 32px; border-radius: 50%;
    border: 2px solid var(--border); border-top-color: var(--accent);
    animation: spin 1s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .proc-title { font-family: var(--font-head); font-size: 26px; font-weight: 700; margin-bottom: 12px; }
  .proc-step { font-size: 14px; color: var(--muted); min-height: 20px; transition: opacity 0.3s; }

  /* RESULT */
  .result-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 28px; flex-wrap: wrap; }
  .result-id { font-size: 12px; color: var(--muted); letter-spacing: 1px; font-family: monospace; }
  .priority-badge { padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; }
  .priority-High { background: rgba(232,72,85,0.15); color: #E84855; }
  .priority-Medium { background: rgba(255,184,0,0.12); color: #FFB800; }
  .priority-Low { background: rgba(107,203,119,0.12); color: #6BCB77; }

  .authority-box { background: var(--bg2); border: 1px solid rgba(0,201,167,0.25); border-radius: 12px;
    padding: 18px 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 14px;
  }
  .authority-icon { font-size: 24px; }
  .authority-name { font-size: 15px; font-weight: 600; color: var(--accent2); }
  .authority-email { font-size: 12px; color: var(--muted); margin-top: 2px; }

  .complaint-box { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px;
    padding: 24px; font-size: 13.5px; line-height: 1.8; color: #C8CCD8; white-space: pre-wrap; font-family: 'DM Sans', sans-serif;
    max-height: 320px; overflow-y: auto;
  }
  .complaint-box::-webkit-scrollbar { width: 4px; }
  .complaint-box::-webkit-scrollbar-track { background: transparent; }
  .complaint-box::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .action-row { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }

  /* REPORTS LIST */
  .report-item { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 20px 24px;
    margin-bottom: 12px; display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center;
    transition: border 0.2s;
  }
  .report-item:hover { border-color: rgba(255,255,255,0.15); }
  .report-id { font-size: 11px; font-family: monospace; color: var(--muted); margin-bottom: 4px; }
  .report-issue { font-size: 15px; font-weight: 500; margin-bottom: 4px; }
  .report-meta { font-size: 12px; color: var(--muted); display: flex; gap: 12px; }
  .status-pill { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.3px; }

  /* ADMIN */
  .admin-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 32px; }
  .admin-stat { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 18px; text-align: center; }
  .admin-stat-num { font-family: var(--font-head); font-size: 28px; font-weight: 800; }
  .admin-stat-lbl { font-size: 11px; color: var(--muted); margin-top: 4px; letter-spacing: 0.5px; }
  .admin-table-head { display: grid; grid-template-columns: 80px 1fr 160px 100px 90px; gap: 12px;
    padding: 10px 20px; font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: 0.8px; text-transform: uppercase;
  }
  .admin-row { display: grid; grid-template-columns: 80px 1fr 160px 100px 90px; gap: 12px;
    padding: 14px 20px; background: var(--card); border: 1px solid var(--border); border-radius: 10px;
    margin-bottom: 8px; font-size: 13px; align-items: center;
  }
  .admin-row:hover { border-color: rgba(255,255,255,0.15); }
  .admin-id { font-family: monospace; font-size: 11px; color: var(--muted); }
  .priority-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 6px; }
  .resolve-btn { padding: 5px 12px; background: rgba(107,203,119,0.1); border: 1px solid rgba(107,203,119,0.25);
    color: #6BCB77; border-radius: 6px; font-size: 11px; cursor: pointer; transition: all 0.2s; font-family: var(--font-body);
  }
  .resolve-btn:hover { background: rgba(107,203,119,0.2); }

  /* ERROR */
  .error-box { background: rgba(232,72,85,0.1); border: 1px solid rgba(232,72,85,0.3); border-radius: 10px;
    padding: 14px 18px; font-size: 13px; color: #E84855; margin-top: 16px; line-height: 1.5;
  }

  .divider { height: 1px; background: var(--border); margin: 32px 0; }
  @media(max-width:600px){
    .admin-grid{grid-template-columns:repeat(2,1fr);}
    .admin-table-head,.admin-row{grid-template-columns:1fr 1fr 80px;}
    .admin-row > *:nth-child(3),.admin-row > *:nth-child(4),.admin-table-head > *:nth-child(3),.admin-table-head > *:nth-child(4){display:none;}
    .stats-bar{grid-template-columns:repeat(3,1fr);}
  }
`;

const ADMIN_DATA = [
  { id: "CR-2024-004", issue: "Flooding / Drainage issue", area: "South Zone", priority: "High", status: "pending" },
  { id: "CR-2024-005", issue: "Power outage", area: "North East Block", priority: "High", status: "in_progress" },
  { id: "CR-2024-006", issue: "Garbage / Waste accumulation", area: "Market District", priority: "Medium", status: "in_progress" },
  { id: "CR-2024-007", issue: "Potholes / Road damage", area: "Ring Road Sector 3", priority: "Medium", status: "pending" },
  { id: "CR-2024-008", issue: "Stray animal problem", area: "Residential Zone C", priority: "Low", status: "resolved" },
];

function generateId() {
  return "CR-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 900) + 100);
}

export default function CivicApp() {
  const [screen, setScreen] = useState("home");
  const [tab, setTab] = useState("report");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('civic_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [intendedTab, setIntendedTab] = useState(null);

  const handleNav = (id, targetScreen = null) => {
    if (['report', 'reports', 'admin'].includes(id) && !currentUser) {
      alert("Please login to continue");
      setIntendedTab(id);
      setTab('login');
      setScreen('login');
      return;
    }
    if (id === 'admin' && currentUser?.role !== 'admin') {
      alert("Access denied. Admin role required to access the Admin Dashboard.\\n(Hint: try admin@civic.com / admin123)");
      return;
    }
    setTab(id);
    setScreen(targetScreen || (id === "report" ? "home" : id));
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('civic_user', JSON.stringify(user));
    if (intendedTab) {
      handleNav(intendedTab, intendedTab === "report" ? "submit" : null);
      setIntendedTab(null);
    } else {
      setTab('report');
      setScreen('home');
    }
  };
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locDetected, setLocDetected] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [procStep, setProcStep] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [reports, setReports] = useState(SAMPLE_REPORTS);
  const [adminData, setAdminData] = useState(ADMIN_DATA);
  const fileRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const detectLocation = () => {
    setLocDetected(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocation("Gandhi Nagar, Tirunelveli - 627001, Tamil Nadu");
          setLocDetected(true);
        },
        () => {
          setLocation("Tirunelveli, Tamil Nadu");
          setLocDetected(true);
        }
      );
    } else {
      setLocation("Tirunelveli, Tamil Nadu");
      setLocDetected(true);
    }
  };

  const handleSubmit = async () => {
    if (!selectedIssue) return;
    const issueObj = ISSUES.find(i => i.id === selectedIssue);
    setScreen("processing");
    setError("");
    setResult(null);

    const steps = [
      "Analyzing submitted details...",
      "Classifying issue type with AI...",
      "Identifying responsible authority...",
      "Drafting formal complaint letter...",
      "Finalizing complaint report...",
    ];

    for (const step of steps) {
      setProcStep(step);
      await new Promise(r => setTimeout(r, 600));
    }

    const prompt = `You are a civic complaint officer generating an official complaint report. Generate a structured response in JSON format only (no markdown, no backticks).

Issue type: ${issueObj.label}
Location: ${location || "Tirunelveli, Tamil Nadu"}
Description: ${description || "The reported issue requires immediate attention from the concerned authority."}
Image provided: ${imagePreview ? "Yes" : "No"}

Return ONLY valid JSON with these fields:
{
  "complaintId": "CR-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}",
  "priorityLevel": "High or Medium or Low",
  "authorityName": "${issueObj.dept}",
  "authorityEmail": "a plausible authority email for Tamil Nadu municipal body",
  "complaintText": "A formal, well-structured complaint letter (200-250 words) addressed to the ${issueObj.dept}. Include: subject, salutation, body paragraphs describing the issue clearly, request for immediate action, formal closing. Use professional civic language.",
  "actionTimeline": "Expected resolution timeline (e.g. 3-5 working days)",
  "referenceNumber": "REF-TN-2024-XXXX format"
}`;

    try {
      let parsed;
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        const data = await res.json();
        const raw = data.content?.map(b => b.text || "").join("") || "";
        const clean = raw.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
      } catch (e) {
        console.warn("API call failed, using mock data:", e);
        // Fallback Mock Data
        parsed = {
          complaintId: "CR-" + new Date().getFullYear() + "-" + (Math.floor(Math.random() * 900) + 100),
          priorityLevel: "High",
          authorityName: issueObj.dept,
          authorityEmail: issueObj.dept.toLowerCase().replace(/ /g, ".") + "@tn.gov.in",
          complaintText: `To,\nThe Commissioner,\n${issueObj.dept},\nTirunelveli, Tamil Nadu.\n\nSubject: Formal Complaint regarding ${issueObj.label}\n\nRespected Sir/Madam,\n\nI am writing to bring to your immediate attention a serious issue regarding ${issueObj.label} at ${location || "Tirunelveli"}. \n\n${description || "The current situation is causing significant inconvenience to the residents and commuters in this area. It poses a safety hazard and requires urgent repair/intervention."}\n\nPlease take the necessary steps to resolve this matter at the earliest. We look forward to a prompt resolution.\n\nThanking you,\nConcerned Citizen`,
          actionTimeline: "3-5 working days",
          referenceNumber: "REF-TN-2024-" + Math.floor(1000 + Math.random() * 9000)
        };
      }
      
      parsed.issueLabel = issueObj.label;
      parsed.location = location || "Tirunelveli, Tamil Nadu";
      setResult(parsed);
      setReports(prev => [{
        id: parsed.complaintId,
        issue: issueObj.label,
        location: parsed.location,
        status: "pending",
        date: "Just now",
        authority: issueObj.dept,
        estimatedDays: Math.floor(Math.random() * 5) + 1,
      }, ...prev]);
      setScreen("result");
    } catch (err) {
      setError("Processing failed: " + err.message);
      setScreen("submit");
    }
  };

  const resolveAdmin = (id) => {
    setAdminData(prev => prev.map(r => r.id === id ? { ...r, status: "resolved" } : r));
  };

  const renderHome = () => (
    <div className="page">
      <div className="hero">
        <div className="hero-badge">
          <span className="nav-dot" />
          AI-Powered Civic Platform
        </div>
        <h1 className="hero-title">
          Report. Track.<br /><span>Resolve.</span>
        </h1>
        <p className="hero-sub">
          Submit civic issues in seconds. Our AI drafts formal complaints, identifies the right authority, and tracks resolution — automatically.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => handleNav("report", "submit")}>
            Report an Issue →
          </button>
          <button className="btn-secondary" onClick={() => handleNav("reports")}>
            Track My Reports
          </button>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-num">1,284</div>
          <div className="stat-label">Issues reported</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: "#6BCB77" }}>847</div>
          <div className="stat-label">Resolved this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: "#00C9A7" }}>4.2d</div>
          <div className="stat-label">Avg. resolution time</div>
        </div>
      </div>

      <div className="section-label">Issue categories</div>
      <div className="category-grid">
        {ISSUES.map(issue => (
          <div key={issue.id} className="cat-card" style={{ "--sel-color": issue.color }}
            onClick={() => { setSelectedIssue(issue.id); handleNav("report", "submit"); }}>
            <div className="cat-icon">{issue.icon}</div>
            <div className="cat-name">{issue.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSubmit = () => (
    <div className="page">
      <h2 style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>
        Submit Report
      </h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>
        Fill in the details below. Our AI will generate and route a formal complaint automatically.
      </p>

      <div className="form-card">
        <h3>Issue category</h3>
        <div className="category-grid">
          {ISSUES.map(issue => (
            <div key={issue.id} className={`cat-card ${selectedIssue === issue.id ? "selected" : ""}`}
              style={{ "--sel-color": issue.color }}
              onClick={() => setSelectedIssue(issue.id)}>
              <div className="cat-icon">{issue.icon}</div>
              <div className="cat-name">{issue.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-card">
        <h3>Issue details</h3>

        <div className="field">
          <label>Description</label>
          <textarea placeholder="Describe the issue in detail — severity, duration, how it affects the public..."
            value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="field">
          <label>Location</label>
          <div className="loc-row">
            <input type="text" placeholder="Street, area, landmark..."
              value={location} onChange={e => setLocation(e.target.value)} />
            <button className="loc-btn" onClick={detectLocation}>📍 Detect</button>
          </div>
          {locDetected && (
            <div className="loc-detected">
              <span>✓</span> Location auto-detected from GPS
            </div>
          )}
        </div>

        <div className="field">
          <label>Upload photo (optional)</label>
          <div className="upload-zone">
            <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileRef} />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="upload-preview" />
            ) : (
              <>
                <div className="upload-icon">📷</div>
                <div className="upload-text">Drag & drop or <span>click to upload</span></div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>PNG, JPG up to 10MB</div>
              </>
            )}
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={handleSubmit} disabled={!selectedIssue}
            style={{ opacity: selectedIssue ? 1 : 0.4, cursor: selectedIssue ? "pointer" : "not-allowed" }}>
            Generate AI Complaint →
          </button>
          <button className="btn-secondary" onClick={() => setScreen("home")}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="page">
      <div className="processing">
        <div className="spinner-ring" />
        <div className="proc-title">AI Processing Your Report</div>
        <div className="proc-step">{procStep}</div>
        <div style={{ marginTop: 32, color: "var(--muted)", fontSize: 13 }}>
          Powered by Claude AI · Anthropic
        </div>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;
    return (
      <div className="page">
        <div className="result-header">
          <div>
            <div className="result-id">{result.complaintId} · {result.referenceNumber}</div>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginTop: 6 }}>
              Complaint Generated ✓
            </h2>
            <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
              {result.issueLabel} · {result.location}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            <span className={`priority-badge priority-${result.priorityLevel}`}>
              {result.priorityLevel} Priority
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>⏱ {result.actionTimeline}</span>
          </div>
        </div>

        <div className="authority-box">
          <div className="authority-icon">🏛</div>
          <div>
            <div className="authority-name">{result.authorityName}</div>
            <div className="authority-email">{result.authorityEmail}</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--accent2)", fontWeight: 500 }}>
            ✓ Routing confirmed
          </div>
        </div>

        <div className="section-label" style={{ marginBottom: 12 }}>Generated complaint letter</div>
        <div className="complaint-box">{result.complaintText}</div>

        <div className="action-row">
          <button className="btn-primary" onClick={() => {
            alert("Complaint submitted and forwarded to " + result.authorityName + " at " + result.authorityEmail);
          }}>
            Submit & Forward →
          </button>
          <button className="btn-secondary" onClick={() => {
            const blob = new Blob([result.complaintText], { type: "text/plain" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = result.complaintId + "_complaint.txt";
            a.click();
          }}>
            Download Letter
          </button>
          <button className="btn-secondary" onClick={() => {
            setSelectedIssue(null); setDescription(""); setLocation("");
            setLocDetected(false); setImagePreview(null);
            setScreen("home");
          }}>
            New Report
          </button>
        </div>
      </div>
    );
  };

  const renderReports = () => (
    <div className="page">
      <h2 style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>
        My Reports
      </h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>
        Track the status of your submitted complaints
      </p>
      {reports.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
          No reports yet. <button style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontSize: "inherit" }}
            onClick={() => { setTab("report"); setScreen("submit"); }}>Submit your first report →</button>
        </div>
      )}
      {reports.map(r => {
        const s = STATUS_META[r.status];
        
        let statusText = r.status;
        if (r.status === 'pending') statusText = `Will be resolved in ${r.estimatedDays} days`;
        else if (r.status === 'in_progress') statusText = `Expected in ${r.estimatedDays} days`;
        else if (r.status === 'resolved') statusText = `Resolved in ${r.estimatedDays} days`;

        return (
          <div key={r.id} className="report-item">
            <div>
              <div className="report-id">{r.id}</div>
              <div className="report-issue">{r.issue}</div>
              <div className="report-meta">
                <span>📍 {r.location}</span>
                <span>🏛 {r.authority}</span>
                <span>🕐 {r.date}</span>
              </div>
            </div>
            <span className="status-pill" style={{ background: s.bg, color: s.color }}>
              {statusText}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderAdmin = () => {
    const counts = adminData.reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a; }, {});
    const priorityColor = { High: "#E84855", Medium: "#FFB800", Low: "#6BCB77" };
    return (
      <div className="page">
        <h2 style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>
          Admin Dashboard
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 28 }}>
          Municipal complaint management — prioritize and resolve
        </p>

        <div className="admin-grid">
          <div className="admin-stat">
            <div className="admin-stat-num" style={{ color: "var(--accent)" }}>{adminData.length + reports.length - SAMPLE_REPORTS.length + SAMPLE_REPORTS.length}</div>
            <div className="admin-stat-lbl">Total complaints</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-num" style={{ color: "#E84855" }}>{(counts.pending || 0)}</div>
            <div className="admin-stat-lbl">Pending</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-num" style={{ color: "#4D9DE0" }}>{counts.in_progress || 0}</div>
            <div className="admin-stat-lbl">In progress</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-num" style={{ color: "#6BCB77" }}>{counts.resolved || 0}</div>
            <div className="admin-stat-lbl">Resolved</div>
          </div>
        </div>

        <div className="section-label">Active complaints</div>
        <div className="admin-table-head">
          <div>ID</div><div>Issue</div><div>Area</div><div>Priority</div><div>Action</div>
        </div>
        {adminData.map(r => (
          <div key={r.id} className="admin-row">
            <div className="admin-id">{r.id}</div>
            <div style={{ fontSize: 13 }}>{r.issue}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.area}</div>
            <div style={{ fontSize: 12 }}>
              <span className="priority-dot" style={{ background: priorityColor[r.priority] }} />
              {r.priority}
            </div>
            <div>
              {r.status !== "resolved" ? (
                <button className="resolve-btn" onClick={() => resolveAdmin(r.id)}>Resolve</button>
              ) : (
                <span style={{ fontSize: 11, color: "#6BCB77" }}>✓ Done</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const mainScreen = () => {
    if (tab === "login") return <div style={{position: 'relative', zIndex: 10}}><Login onLogin={handleLogin} intendedTab={intendedTab} /></div>;
    if (screen === "processing") return renderProcessing();
    if (screen === "result") return renderResult();
    if (tab === "report" && screen === "submit") return renderSubmit();
    if (tab === "reports") return renderReports();
    if (tab === "admin") return renderAdmin();
    return renderHome();
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="noise" />
        <div className="glow" />
        <div className="glow2" />
        <nav className="nav">
          <div className="nav-brand" onClick={() => handleNav("report", "home")} style={{ cursor: "pointer" }}>
            <div className="nav-dot" />
            CivicAI
          </div>
          <div className="nav-tabs">
            {[["report", "Report Issue"], ["reports", "My Reports"], ["admin", "Admin"]].map(([id, label]) => (
              <button key={id} className={`nav-tab ${tab === id && screen !== "processing" && screen !== "result" ? "active" : ""}`}
                onClick={() => handleNav(id)}>
                {label}
              </button>
            ))}
            {currentUser ? (
              <button className="nav-tab" style={{ color: "var(--accent2)" }} onClick={() => {
                setCurrentUser(null);
                localStorage.removeItem('civic_user');
                setTab('report');
                setScreen('home');
              }}>
                Logout ({currentUser.name})
              </button>
            ) : (
              <button className={`nav-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab('login'); setScreen('login'); }}>
                Login
              </button>
            )}
          </div>
        </nav>
        {mainScreen()}
      </div>
    </>
  );
}