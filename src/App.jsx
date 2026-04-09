import { useState, useEffect, useCallback } from "react";

const BIOMARKER_DEFS = [
  { key: "estradiol", name: "Estradiol", unit: "pg/mL", low: 7.6, high: 42.6, category: "Hormones" },
  { key: "testosterone_total", name: "Testosterone (Total)", unit: "ng/dL", low: 264, high: 916, category: "Hormones" },
  { key: "testosterone_free", name: "Testosterone (Free)", unit: "ng/dL", low: 3.25, high: 30.66, category: "Hormones" },
  { key: "cortisol", name: "Cortisol", unit: "µg/dL", low: 4, high: 22, category: "Hormones" },
  { key: "dhea_s", name: "DHEA-S", unit: "µg/dL", low: 44.3, high: 331, category: "Hormones" },
  { key: "shbg", name: "SHBG", unit: "nmol/L", low: 16.5, high: 55.9, category: "Hormones" },
  { key: "test_cortisol_ratio", name: "Test:Cortisol Ratio", unit: "Units", low: 33, high: 100, category: "Hormones" },
  { key: "tsh", name: "TSH", unit: "µIU/mL", low: 0.45, high: 4.5, category: "Hormones" },
  { key: "fsh", name: "FSH", unit: "mIU/mL", low: 1.5, high: 12.4, category: "Hormones" },
  { key: "lh", name: "LH", unit: "mIU/mL", low: 1.7, high: 8.6, category: "Hormones" },
  { key: "prolactin", name: "Prolactin", unit: "ng/mL", low: 2.0, high: 18.0, category: "Hormones" },
  { key: "progesterone", name: "Progesterone", unit: "ng/mL", low: 0, high: 0.595, category: "Hormones" },
  { key: "pregnenolone", name: "Pregnenolone", unit: "ng/mL", low: 0.38, high: 3.5, category: "Hormones" },
  { key: "dht", name: "DHT", unit: "ng/dL", low: 14.8, high: 101.8, category: "Hormones" },
  { key: "igf1", name: "IGF-1", unit: "ng/mL", low: 40, high: 225, category: "Hormones" },
  { key: "parathyroid_hormone", name: "Parathyroid Hormone", unit: "pg/mL", low: 15, high: 65, category: "Hormones" },
  { key: "free_t3", name: "Free T3", unit: "pg/mL", low: 2.0, high: 4.4, category: "Thyroid" },
  { key: "free_t4", name: "Free T4", unit: "ng/dL", low: 0.9, high: 1.7, category: "Thyroid" },
  { key: "t3_total", name: "T3 (Total)", unit: "ng/mL", low: 0.8, high: 2.0, category: "Thyroid" },
  { key: "t4_total", name: "T4 (Total)", unit: "µg/dL", low: 4.5, high: 9.8, category: "Thyroid" },
  { key: "reverse_t3", name: "Reverse T3", unit: "ng/dL", low: 7, high: 23, category: "Thyroid" },
  { key: "anti_tg", name: "Anti-Thyroglobulin", unit: "IU/mL", low: 0, high: 115, category: "Thyroid" },
  { key: "total_cholesterol", name: "Total Cholesterol", unit: "mg/dL", low: 125, high: 200, category: "Heart" },
  { key: "ldl", name: "LDL", unit: "mg/dL", low: 0, high: 100, category: "Heart" },
  { key: "hdl", name: "HDL", unit: "mg/dL", low: 40, high: 100, category: "Heart" },
  { key: "triglycerides", name: "Triglycerides", unit: "mg/dL", low: 0, high: 150, category: "Heart" },
  { key: "apob", name: "ApoB", unit: "mg/dL", low: 0, high: 90, category: "Heart" },
  { key: "lpa", name: "Lp(a)", unit: "mg/dL", low: 0, high: 29, category: "Heart" },
  { key: "lpa_nmol", name: "Lp(a) (nmol)", unit: "nmol/L", low: 0, high: 75, category: "Heart" },
  { key: "homocysteine", name: "Homocysteine", unit: "µmol/L", low: 0, high: 9, category: "Heart" },
  { key: "ox_ldl", name: "Oxidized LDL", unit: "U/L", low: 0, high: 99.1, category: "Heart" },
  { key: "hscrp", name: "hsCRP", unit: "mg/L", low: 0, high: 1.0, category: "Inflammation" },
  { key: "uric_acid", name: "Uric Acid", unit: "mg/dL", low: 3.4, high: 7.0, category: "Inflammation" },
  { key: "iron", name: "Iron", unit: "µg/dL", low: 50, high: 180, category: "Blood" },
  { key: "ferritin", name: "Ferritin", unit: "ng/mL", low: 30, high: 400, category: "Blood" },
  { key: "transferrin_sat", name: "Transferrin Sat.", unit: "%", low: 15, high: 50, category: "Blood" },
  { key: "tibc", name: "TIBC", unit: "µg/dL", low: 171, high: 505, category: "Blood" },
  { key: "hemoglobin", name: "Hemoglobin", unit: "g/dL", low: 13.5, high: 17.5, category: "Blood" },
  { key: "hematocrit", name: "Hematocrit", unit: "%", low: 38.3, high: 48.6, category: "Blood" },
  { key: "rbc", name: "RBC", unit: "M/µL", low: 4.35, high: 5.65, category: "Blood" },
  { key: "wbc", name: "WBC", unit: "K/µL", low: 3.4, high: 10.8, category: "Blood" },
  { key: "platelets", name: "Platelets", unit: "K/µL", low: 135, high: 317, category: "Blood" },
  { key: "mcv", name: "MCV", unit: "fL", low: 79, high: 92.2, category: "Blood" },
  { key: "mch", name: "MCH", unit: "pg", low: 25.7, high: 32.2, category: "Blood" },
  { key: "mchc", name: "MCHC", unit: "g/dL", low: 32.3, high: 36.5, category: "Blood" },
  { key: "rdw", name: "RDW", unit: "%", low: 11, high: 15, category: "Blood" },
  { key: "mpv", name: "MPV", unit: "fL", low: 7.5, high: 12.5, category: "Blood" },
  { key: "vitamin_d", name: "Vitamin D", unit: "ng/mL", low: 40, high: 100, category: "Vitamins" },
  { key: "vitamin_b12", name: "Vitamin B12", unit: "pg/mL", low: 200, high: 1100, category: "Vitamins" },
  { key: "folate", name: "Folate", unit: "ng/mL", low: 2.7, high: 17, category: "Vitamins" },
  { key: "magnesium", name: "Magnesium", unit: "mg/dL", low: 1.7, high: 2.6, category: "Vitamins" },
  { key: "zinc", name: "Zinc", unit: "mcg/mL", low: 0.5, high: 1.0, category: "Vitamins" },
  { key: "copper", name: "Copper", unit: "mcg/mL", low: 0.6, high: 1.8, category: "Vitamins" },
  { key: "coq10", name: "CoQ10", unit: "µg/mL", low: 0.56, high: 2.78, category: "Vitamins" },
  { key: "vitamin_c", name: "Vitamin C", unit: "mg/dL", low: 0.2, high: 1.1, category: "Vitamins" },
  { key: "vitamin_a", name: "Vitamin A", unit: "mcg/dL", low: 40.8, high: 154.5, category: "Vitamins" },
  { key: "vitamin_e", name: "Vitamin E", unit: "mg/L", low: 7.4, high: 30.6, category: "Vitamins" },
  { key: "vitamin_k1", name: "Vitamin K1", unit: "ng/mL", low: 0.1, high: 8.1, category: "Vitamins" },
  { key: "vitamin_k2", name: "Vitamin K2", unit: "ng/mL", low: 0.1, high: 5.19, category: "Vitamins" },
  { key: "vitamin_b1", name: "Vitamin B1", unit: "nmol/L", low: 1.4, high: 71.3, category: "Vitamins" },
  { key: "vitamin_b2", name: "Vitamin B2", unit: "mcg/L", low: 5.6, high: 126.1, category: "Vitamins" },
  { key: "vitamin_b3", name: "Vitamin B3", unit: "ng/mL", low: 2.6, high: 36.1, category: "Vitamins" },
  { key: "vitamin_b5", name: "Vitamin B5", unit: "mcg/L", low: 22.7, high: 429.2, category: "Vitamins" },
  { key: "vitamin_b6", name: "Vitamin B6", unit: "ng/mL", low: 2.8, high: 76.2, category: "Vitamins" },
  { key: "albumin", name: "Albumin", unit: "g/dL", low: 3.6, high: 5.1, category: "Liver" },
  { key: "alt", name: "ALT", unit: "U/L", low: 9, high: 46, category: "Liver" },
  { key: "ast", name: "AST", unit: "U/L", low: 10, high: 35, category: "Liver" },
  { key: "ggt", name: "GGT", unit: "U/L", low: 8, high: 61, category: "Liver" },
  { key: "alp", name: "Alk. Phosphatase", unit: "U/L", low: 35, high: 144, category: "Liver" },
  { key: "bilirubin_total", name: "Bilirubin (Total)", unit: "mg/dL", low: 0.2, high: 1.2, category: "Liver" },
  { key: "protein_total", name: "Protein (Total)", unit: "g/dL", low: 6.2, high: 8.0, category: "Liver" },
  { key: "glucose", name: "Glucose (Fasting)", unit: "mg/dL", low: 65, high: 99, category: "Metabolic" },
  { key: "hba1c", name: "HbA1c", unit: "%", low: 4, high: 5.6, category: "Metabolic" },
  { key: "insulin", name: "Insulin (Fasting)", unit: "µIU/mL", low: 2.6, high: 24.9, category: "Metabolic" },
  { key: "homa_ir", name: "HOMA-IR", unit: "", low: 0.7, high: 2.0, category: "Metabolic" },
  { key: "creatine_kinase", name: "Creatine Kinase", unit: "U/L", low: 30, high: 200, category: "Metabolic" },
  { key: "creatinine", name: "Creatinine", unit: "mg/dL", low: 0.74, high: 1.35, category: "Kidney" },
  { key: "bun", name: "BUN", unit: "mg/dL", low: 6, high: 20, category: "Kidney" },
  { key: "egfr", name: "eGFR", unit: "mL/min", low: 90, high: 200, category: "Kidney" },
  { key: "sodium", name: "Sodium", unit: "mEq/L", low: 136, high: 145, category: "Electrolytes" },
  { key: "potassium", name: "Potassium", unit: "mEq/L", low: 3.5, high: 5.1, category: "Electrolytes" },
  { key: "calcium", name: "Calcium", unit: "mg/dL", low: 8.7, high: 10.2, category: "Electrolytes" },
  { key: "chloride", name: "Chloride", unit: "mmol/L", low: 98, high: 107, category: "Electrolytes" },
  { key: "carbon_dioxide", name: "CO2", unit: "mmol/L", low: 18, high: 29, category: "Electrolytes" },
  { key: "psa", name: "PSA", unit: "ng/mL", low: 0, high: 4, category: "Other" },
];

const CATEGORIES = [...new Set(BIOMARKER_DEFS.map(b => b.category))];

function gs(v, lo, hi) { if (v == null) return "none"; return v < lo ? "low" : v > hi ? "high" : "ok"; }

function Dot({ s }) {
  if (s === "none") return null;
  return <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: s === "ok" ? "#22c55e" : "#ef4444", marginRight: 4, flexShrink: 0 }} />;
}

function Arrow({ cur, prev }) {
  if (cur == null || prev == null) return null;
  const d = cur - prev, p = prev ? Math.abs((d / prev) * 100).toFixed(0) : 0;
  if (Math.abs(d) < 0.01) return null;
  return <span style={{ color: d > 0 ? "#f59e0b" : "#3b82f6", fontSize: 9, marginLeft: 2 }}>{d > 0 ? "▲" : "▼"}{p}%</span>;
}

function Spark({ values, lo, hi }) {
  if (!values || values.filter(v => v !== null).length < 2) return null;
  const vd = values.map((v, i) => v !== null ? { v, i } : null).filter(Boolean);
  const mn = Math.min(...vd.map(p => p.v), lo), mx = Math.max(...vd.map(p => p.v), hi), r = mx - mn || 1;
  const w = 180, h = 48, pd = 4, len = Math.max(values.length - 1, 1);
  const pts = vd.map(p => `${pd + (p.i / len) * (w - 2 * pd)},${h - pd - ((p.v - mn) / r) * (h - 2 * pd)}`).join(" ");
  const yL = h - pd - ((lo - mn) / r) * (h - 2 * pd), yH = h - pd - ((hi - mn) / r) * (h - 2 * pd);
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <rect x={pd} y={Math.min(yL, yH)} width={w - 2 * pd} height={Math.abs(yH - yL)} fill="rgba(34,197,94,0.07)" rx={2} />
      <line x1={pd} y1={yL} x2={w - pd} y2={yL} stroke="rgba(34,197,94,0.15)" strokeWidth={0.5} strokeDasharray="3,3" />
      <line x1={pd} y1={yH} x2={w - pd} y2={yH} stroke="rgba(34,197,94,0.15)" strokeWidth={0.5} strokeDasharray="3,3" />
      <polyline points={pts} fill="none" stroke="#475569" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      {vd.map((p, i) => { const x = pd + (p.i / len) * (w - 2 * pd), y = h - pd - ((p.v - mn) / r) * (h - 2 * pd); return <circle key={i} cx={x} cy={y} r={3.5} fill={gs(p.v, lo, hi) === "ok" ? "#22c55e" : "#ef4444"} stroke="#fff" strokeWidth={1.2} />; })}
    </svg>
  );
}

export default function App() {
  const [data, setData] = useState({ tests: [] });
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("All");
  const [oor, setOor] = useState(false);
  const [search, setSearch] = useState("");
  const [hidden, setHidden] = useState([]);
  const [modal, setModal] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newVals, setNewVals] = useState({});
  const [upText, setUpText] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [ec, setEc] = useState(null);
  const [ev, setEv] = useState("");
  const [selBio, setSelBio] = useState(null);
  const [noteEdit, setNoteEdit] = useState(null); // { date, key, text } for cell notes
  const [bioNoteText, setBioNoteText] = useState("");

  useEffect(() => { (async () => { try { const r = await window.storage.get("bloodwork-data-v2"); if (r?.value) setData(JSON.parse(r.value)); } catch {} setLoading(false); })(); }, []);
  const save = useCallback(async d => { setData(d); try { await window.storage.set("bloodwork-data-v2", JSON.stringify(d)); } catch {} }, []);

  const sorted = [...(data.tests || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
  const vis = sorted.filter(t => !hidden.includes(t.date));

  // Check which biomarkers have ANY data
  const hasData = new Set();
  sorted.forEach(t => Object.keys(t.values).forEach(k => hasData.add(k)));

  const filtered = BIOMARKER_DEFS.filter(b => {
    if (!hasData.has(b.key)) return false; // hide completely empty rows
    if (cat !== "All" && b.category !== cat) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (oor) {
      const lv = sorted.reduce((f, t) => f !== null ? f : (t.values[b.key] ?? null), null);
      if (lv === null) return false;
      const s = gs(lv, b.low, b.high);
      if (s === "ok" || s === "none") return false;
    }
    return true;
  });

  const doManual = () => { if (!newDate) return; const ex = data.tests.find(t => t.date === newDate); if (ex) save({ tests: data.tests.map(t => t.date === newDate ? { ...t, values: { ...t.values, ...newVals } } : t) }); else save({ tests: [...data.tests, { date: newDate, values: newVals }] }); setNewVals({}); setNewDate(""); setModal(null); };

  const doParse = async () => {
    if (!upText.trim()) return; setParsing(true); setParsed(null);
    try {
      const list = BIOMARKER_DEFS.map(b => `${b.key}: "${b.name}" (${b.unit})`).join("\n");
      const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: `Parse blood work, return ONLY JSON: {"date":"YYYY-MM-DD","values":{"key":number}}. Keys:\n${list}\n\nData:\n${upText}` }] }) });
      const res = await r.json(); setParsed(JSON.parse(res.content.map(c => c.text || "").join("").replace(/```json|```/g, "").trim()));
    } catch { setParsed({ error: "Parse failed." }); } setParsing(false);
  };

  const confirmP = () => { if (!parsed || parsed.error) return; const d = parsed.date || new Date().toISOString().split("T")[0]; const ex = data.tests.find(t => t.date === d); if (ex) save({ tests: data.tests.map(t => t.date === d ? { ...t, values: { ...t.values, ...parsed.values } } : t) }); else save({ tests: [...data.tests, { date: d, values: parsed.values }] }); setParsed(null); setUpText(""); setModal(null); };

  const doBulk = () => { if (!bulkText.trim()) return; try { const p = JSON.parse(bulkText); if (Array.isArray(p)) { const m = [...data.tests]; p.forEach(n => { const i = m.findIndex(t => t.date === n.date); if (i >= 0) m[i] = { ...m[i], values: { ...m[i].values, ...n.values } }; else m.push(n); }); save({ tests: m }); } setBulkText(""); setModal(null); } catch { alert("Invalid JSON."); } };

  const saveCellNote = (date, key, text) => {
    save({ ...data, tests: data.tests.map(t => {
      if (t.date !== date) return t;
      const notes = { ...(t.notes || {}) };
      if (text && text.trim()) notes[key] = text.trim(); else delete notes[key];
      return { ...t, notes };
    }) });
    setNoteEdit(null);
  };
  const saveBioNote = (key, text) => {
    const bn = { ...(data.biomarkerNotes || {}) };
    if (text && text.trim()) bn[key] = text.trim(); else delete bn[key];
    save({ ...data, biomarkerNotes: bn });
  };

  const upCell = (date, key, val) => { const n = val === "" ? null : parseFloat(val); save({ tests: data.tests.map(t => { if (t.date === date) { const v = { ...t.values }; if (n == null) delete v[key]; else v[key] = n; return { ...t, values: v }; } return t; }) }); setEc(null); };

  if (loading) return <div style={{ padding: 40, textAlign: "center", fontFamily: "system-ui" }}>Loading...</div>;

  const f = "'DM Sans',sans-serif", m = "'JetBrains Mono','SF Mono',monospace";
  const activeCount = BIOMARKER_DEFS.filter(b => hasData.has(b.key)).length;

  return (
    <div style={{ fontFamily: f, minHeight: "100vh", color: "#1e293b" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(148,163,184,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#0f766e,#14b8a6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>🩸</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Blood Work Tracker</h1>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>{sorted.length} tests • {activeCount} active markers{hidden.length > 0 ? ` • ${hidden.length} cols hidden` : ""}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <button onClick={() => { setModal("upload"); setParsed(null); setUpText(""); }} style={B("#0f766e")}>✨ AI Upload</button>
          <button onClick={() => { setModal("manual"); setNewVals({}); setNewDate(""); }} style={B("#3b82f6")}>+ Manual</button>
          <button onClick={() => { setModal("import"); setBulkText(""); }} style={B("#8b5cf6")}>⬆ Import</button>
          <button onClick={() => setModal("cols")} style={B("#64748b")}>👁 Columns</button>
          <button onClick={() => { const b = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "bloodwork.json"; a.click(); }} style={B("#475569")}>⬇</button>
        </div>
      </div>

      <div style={{ padding: "8px 14px 4px", display: "flex", gap: 4, overflowX: "auto", alignItems: "center" }}>
        {["All", ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ padding: "4px 10px", borderRadius: 14, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: f, whiteSpace: "nowrap", background: cat === c && !oor ? "#0f766e" : "rgba(148,163,184,0.08)", color: cat === c && !oor ? "#fff" : "#64748b" }}>{c}</button>
        ))}
        <div style={{ width: 1, height: 20, background: "#e2e8f0", margin: "0 4px", flexShrink: 0 }} />
        <button onClick={() => setOor(!oor)} style={{ padding: "4px 10px", borderRadius: 14, border: oor ? "1.5px solid #ef4444" : "1.5px solid transparent", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: f, whiteSpace: "nowrap", background: oor ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.04)", color: oor ? "#ef4444" : "#94a3b8" }}>🔴 Out of Range</button>
      </div>

      <div style={{ padding: "6px 14px 8px" }}>
        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", maxWidth: 240, padding: "5px 10px", borderRadius: 7, border: "1px solid rgba(148,163,184,0.2)", fontSize: 11, fontFamily: f, outline: "none", boxSizing: "border-box" }} />
      </div>

      <div style={{ overflow: "auto", maxHeight: "calc(100vh - 170px)" }}>
        <table style={{ width: "max-content", minWidth: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 11 }}>
          <thead>
            <tr>
              <th style={{ ...STH, left: 0, zIndex: 30, minWidth: 160, background: "#f8fafc", borderRight: "1px solid #e2e8f0" }}>Biomarker</th>
              <th style={{ ...STH, left: 160, zIndex: 30, minWidth: 74, background: "#f8fafc", borderRight: "1px solid #e2e8f0" }}>Range</th>
              <th style={{ ...STH, left: 234, zIndex: 30, minWidth: 190, background: "#f8fafc", borderRight: "2px solid #cbd5e1" }}>Trend</th>
              {vis.map(t => (
                <th key={t.date} style={{ ...STH, minWidth: 105, textAlign: "center", background: "#f8fafc", borderRight: "1px solid rgba(226,232,240,0.5)" }}>
                  <div style={{ fontWeight: 700, fontSize: 11 }}>{new Date(t.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>{new Date(t.date + "T12:00:00").getFullYear()}</div>
                  <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 1 }}>
                    <span style={{ fontSize: 9, color: "#94a3b8" }}>{Object.keys(t.values).length}</span>
                    <button onClick={() => setHidden(p => [...p, t.date])} title="Hide" style={{ fontSize: 9, color: "#94a3b8", background: "none", border: "none", cursor: "pointer", padding: 0 }}>👁‍🗨</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(bio => {
              const allV = sorted.map(t => t.values[bio.key] ?? null);
              const visV = vis.map(t => t.values[bio.key] ?? null);
              const latest = visV[0], prev = visV.find((v, i) => i > 0 && v !== null) ?? null;
              const st = gs(latest, bio.low, bio.high);
              return (
                <tr key={bio.key} style={{ cursor: "pointer" }} onClick={() => { const k = selBio === bio.key ? null : bio.key; setSelBio(k); setBioNoteText(k ? (data.biomarkerNotes?.[k] || "") : ""); }}>
                  <td style={{ ...STD, left: 0, zIndex: 10, minWidth: 160, background: "#fff", borderRight: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 3, fontWeight: 500, fontSize: 12 }}><Dot s={st} />{bio.name}{data.biomarkerNotes?.[bio.key] && <span title={data.biomarkerNotes[bio.key]} onClick={e => { e.stopPropagation(); setSelBio(bio.key); setBioNoteText(data.biomarkerNotes[bio.key] || ""); }} style={{ fontSize: 10, marginLeft: 3, cursor: "pointer", opacity: 0.7 }}>📝</span>}</div>
                    <div style={{ fontSize: 9, color: "#94a3b8", marginLeft: 11 }}>{bio.category}</div>
                  </td>
                  <td style={{ ...STD, left: 160, zIndex: 10, minWidth: 74, background: "#fff", borderRight: "1px solid #f1f5f9", fontFamily: m, fontSize: 9, color: "#64748b" }}>{bio.low}–{bio.high}<br /><span style={{ fontSize: 8 }}>{bio.unit}</span></td>
                  <td style={{ ...STD, left: 234, zIndex: 10, minWidth: 190, background: "#fff", borderRight: "2px solid #e2e8f0" }}><Spark values={allV.slice().reverse()} lo={bio.low} hi={bio.high} /></td>
                  {vis.map((t, ti) => {
                    const v = t.values[bio.key], cs = gs(v, bio.low, bio.high), ed = ec === `${t.date}-${bio.key}`;
                    const cellNote = t.notes?.[bio.key];
                    return (
                      <td key={t.date} style={{ padding: "6px 5px", textAlign: "center", fontFamily: m, fontSize: 11, background: (cs === "high" || cs === "low") ? "rgba(239,68,68,0.03)" : "transparent", borderBottom: "1px solid rgba(241,245,249,0.8)", borderRight: "1px solid rgba(241,245,249,0.4)" }}
                        onDoubleClick={e => { e.stopPropagation(); setEc(`${t.date}-${bio.key}`); setEv(v != null ? String(v) : ""); }}
                        onContextMenu={e => { e.preventDefault(); e.stopPropagation(); setNoteEdit({ date: t.date, key: bio.key, text: cellNote || "" }); }}>
                        {ed ? <input autoFocus value={ev} onChange={e => setEv(e.target.value)} onBlur={() => upCell(t.date, bio.key, ev)} onKeyDown={e => { if (e.key === "Enter") upCell(t.date, bio.key, ev); if (e.key === "Escape") setEc(null); }} onClick={e => e.stopPropagation()} style={{ width: 50, padding: "1px 3px", textAlign: "center", fontSize: 10, fontFamily: m, border: "2px solid #0f766e", borderRadius: 3, outline: "none" }} />
                          : v != null ? <span><Dot s={cs} /><span style={{ color: cs !== "ok" && cs !== "none" ? "#ef4444" : "inherit", fontWeight: cs !== "ok" && cs !== "none" ? 600 : 400 }}>{v}</span>{ti === 0 && <Arrow cur={v} prev={prev} />}{cellNote && <span title={cellNote} onClick={e => { e.stopPropagation(); setNoteEdit({ date: t.date, key: bio.key, text: cellNote }); }} style={{ fontSize: 9, marginLeft: 2, cursor: "pointer", opacity: 0.7 }}>📝</span>}</span>
                          : <span style={{ color: "#e2e8f0" }}>—</span>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={3 + vis.length} style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>{oor ? "🎉 All biomarkers are in range!" : "No matching biomarkers"}</td></tr>}
          </tbody>
        </table>
      </div>

      {sorted.length > 0 && <div style={{ fontSize: 10, color: "#94a3b8", textAlign: "center", padding: 6 }}>Double-click to edit value • Right-click to add note • Click row for detail</div>}

      {selBio && (() => {
        const bio = BIOMARKER_DEFS.find(b => b.key === selBio); if (!bio) return null;
        const vals = sorted.map(t => ({ d: t.date, v: t.values[bio.key] ?? null })).filter(x => x.v !== null);
        return (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "42vh", background: "#fff", borderTop: "2px solid #0f766e", padding: "12px 14px", overflowY: "auto", boxShadow: "0 -4px 20px rgba(0,0,0,0.1)", zIndex: 100 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <h3 style={{ margin: 0, fontSize: 14 }}>{bio.name} <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>{bio.unit} • {bio.low}–{bio.high}</span></h3>
              <button onClick={() => setSelBio(null)} style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#94a3b8" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {vals.map(x => { const n = sorted.find(t => t.date === x.d)?.notes?.[bio.key]; return <div key={x.d} style={{ padding: "4px 10px", borderRadius: 7, fontSize: 11, background: gs(x.v, bio.low, bio.high) === "ok" ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)", border: `1px solid ${gs(x.v, bio.low, bio.high) === "ok" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)"}` }}><div style={{ fontFamily: m, fontWeight: 600, fontSize: 14 }}>{x.v}{n && <span title={n} onClick={() => setNoteEdit({ date: x.d, key: bio.key, text: n })} style={{ fontSize: 10, marginLeft: 3, cursor: "pointer", opacity: 0.7 }}>📝</span>}</div><div style={{ fontSize: 9, color: "#94a3b8" }}>{new Date(x.d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}</div></div>; })}
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 6 }}>
              <label style={LBL}>📝 Biomarker Note</label>
              <textarea value={bioNoteText} onChange={e => setBioNoteText(e.target.value)} onFocus={() => { if (!bioNoteText) setBioNoteText(data.biomarkerNotes?.[bio.key] || ""); }} placeholder="Add a general note for this biomarker..." style={{ ...TA, minHeight: 50 }} onClick={e => e.stopPropagation()} />
              <button onClick={() => saveBioNote(bio.key, bioNoteText)} style={{ ...B("#0f766e"), marginTop: 4 }}>Save Note</button>
              {data.biomarkerNotes?.[bio.key] && <button onClick={() => { saveBioNote(bio.key, ""); setBioNoteText(""); }} style={{ ...B("#ef4444"), marginTop: 4, marginLeft: 4 }}>Delete</button>}
            </div>
          </div>
        );
      })()}

      {noteEdit && <Modal onClose={() => setNoteEdit(null)}>
        <h2 style={{ margin: "0 0 6px", fontSize: 15 }}>📝 Cell Note</h2>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>{BIOMARKER_DEFS.find(b => b.key === noteEdit.key)?.name} — {new Date(noteEdit.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
        <textarea autoFocus value={noteEdit.text} onChange={e => setNoteEdit({ ...noteEdit, text: e.target.value })} placeholder="Add note for this specific reading..." style={TA} />
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <button onClick={() => saveCellNote(noteEdit.date, noteEdit.key, noteEdit.text)} style={{ ...B("#0f766e"), flex: 1 }}>Save</button>
          <button onClick={() => saveCellNote(noteEdit.date, noteEdit.key, "")} style={{ ...B("#ef4444"), flex: 1 }}>Delete</button>
          <button onClick={() => setNoteEdit(null)} style={{ ...B("#64748b"), flex: 1 }}>Cancel</button>
        </div>
      </Modal>}

      {/* MODALS */}
      {modal === "cols" && <Modal onClose={() => setModal(null)}>
        <h2 style={{ margin: "0 0 6px", fontSize: 15 }}>👁 Column Visibility</h2>
        {hidden.length > 0 && <button onClick={() => setHidden([])} style={{ ...B("#0f766e"), marginBottom: 8, fontSize: 11 }}>Show All ({hidden.length} hidden)</button>}
        <div style={{ maxHeight: 360, overflowY: "auto" }}>
          {sorted.map(t => { const h = hidden.includes(t.date); return (
            <div key={t.date} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(148,163,184,0.06)" }}>
              <span style={{ fontSize: 12, fontWeight: 500 }}>{new Date(t.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} <span style={{ color: "#94a3b8", fontSize: 10 }}>({Object.keys(t.values).length})</span></span>
              <button onClick={() => setHidden(p => h ? p.filter(d => d !== t.date) : [...p, t.date])} style={{ padding: "2px 10px", borderRadius: 5, border: "1px solid", cursor: "pointer", fontSize: 10, fontFamily: f, fontWeight: 500, background: h ? "rgba(239,68,68,0.03)" : "rgba(34,197,94,0.03)", borderColor: h ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)", color: h ? "#ef4444" : "#22c55e" }}>{h ? "Hidden" : "Visible"}</button>
            </div>); })}
        </div>
      </Modal>}

      {modal === "upload" && <Modal onClose={() => setModal(null)}>
        <h2 style={{ margin: "0 0 6px", fontSize: 15 }}>✨ AI Upload</h2>
        <textarea value={upText} onChange={e => setUpText(e.target.value)} placeholder="Paste lab results..." style={TA} />
        {!parsed && <button onClick={doParse} disabled={parsing} style={{ ...B("#0f766e"), marginTop: 8, width: "100%", opacity: parsing ? 0.6 : 1 }}>{parsing ? "Parsing..." : "Parse"}</button>}
        {parsed && !parsed.error && <div style={{ marginTop: 10 }}>
          <h3 style={{ fontSize: 12, margin: "0 0 4px" }}>Parsed — {parsed.date}</h3>
          <div style={{ maxHeight: 150, overflowY: "auto", background: "rgba(248,250,252,0.8)", borderRadius: 7, padding: 6 }}>
            {Object.entries(parsed.values).map(([k, v]) => { const b = BIOMARKER_DEFS.find(x => x.key === k); return b ? <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: 11 }}><span>{b.name}</span><span style={{ fontFamily: m }}>{v}</span></div> : null; })}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}><button onClick={confirmP} style={{ ...B("#0f766e"), flex: 1 }}>✓ Save</button><button onClick={() => setParsed(null)} style={{ ...B("#64748b"), flex: 1 }}>↻ Redo</button></div>
        </div>}
        {parsed?.error && <div style={{ marginTop: 6, color: "#ef4444", fontSize: 11 }}>{parsed.error}</div>}
      </Modal>}

      {modal === "manual" && <Modal onClose={() => setModal(null)}>
        <h2 style={{ margin: "0 0 8px", fontSize: 15 }}>Manual Entry</h2>
        <label style={LBL}>Date</label>
        <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ ...INP, marginBottom: 8 }} />
        <div style={{ maxHeight: 320, overflowY: "auto" }}>
          {CATEGORIES.map(c => <div key={c}><div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", margin: "6px 0 2px" }}>{c}</div>
            {BIOMARKER_DEFS.filter(b => b.category === c).map(b => <div key={b.key} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}><label style={{ fontSize: 11, flex: 1, minWidth: 110 }}>{b.name}</label><input type="number" step="any" value={newVals[b.key] || ""} onChange={e => setNewVals({ ...newVals, [b.key]: e.target.value ? parseFloat(e.target.value) : undefined })} style={{ ...INP, width: 76, textAlign: "right" }} /></div>)}
          </div>)}
        </div>
        <button onClick={doManual} style={{ ...B("#3b82f6"), marginTop: 8, width: "100%" }}>Save</button>
      </Modal>}

      {modal === "import" && <Modal onClose={() => setModal(null)}>
        <h2 style={{ margin: "0 0 6px", fontSize: 15 }}>⬆ Bulk Import</h2>
        <details style={{ fontSize: 10, color: "#64748b", marginBottom: 6 }}><summary style={{ cursor: "pointer", fontWeight: 500 }}>Keys ({BIOMARKER_DEFS.length})</summary><div style={{ maxHeight: 100, overflowY: "auto", fontFamily: m, fontSize: 9, marginTop: 3 }}>{BIOMARKER_DEFS.map(b => <div key={b.key}>{b.key}</div>)}</div></details>
        <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} placeholder='[{"date":"2024-11-05","values":{"glucose":83}}]' style={TA} />
        <button onClick={doBulk} style={{ ...B("#8b5cf6"), marginTop: 8, width: "100%" }}>Import</button>
      </Modal>}

      {data.tests.length > 0 && <div style={{ textAlign: "center", padding: "4px 14px 14px" }}><button onClick={() => { if (confirm("Delete ALL?")) save({ tests: [] }); }} style={{ background: "none", border: "none", color: "#ef4444", fontSize: 10, cursor: "pointer", opacity: 0.4 }}>Reset All</button></div>}
    </div>
  );
}

function Modal({ onClose, children }) {
  return <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }} onClick={onClose}><div style={{ background: "#fff", borderRadius: 12, padding: 16, width: "100%", maxWidth: 460, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>{children}</div></div>;
}

function B(bg) { return { padding: "5px 11px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", background: bg, color: "#fff" }; }
const STH = { position: "sticky", top: 0, zIndex: 20, padding: "7px 7px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#64748b", whiteSpace: "nowrap", borderBottom: "2px solid #e2e8f0" };
const STD = { padding: "6px 7px", whiteSpace: "nowrap", borderBottom: "1px solid rgba(241,245,249,0.8)" };
const INP = { padding: "4px 6px", borderRadius: 5, border: "1px solid rgba(148,163,184,0.25)", fontSize: 11, fontFamily: "'DM Sans',sans-serif", outline: "none" };
const LBL = { fontSize: 10, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 2 };
const TA = { width: "100%", minHeight: 140, padding: 7, borderRadius: 7, border: "1px solid rgba(148,163,184,0.25)", fontSize: 11, fontFamily: "'JetBrains Mono',monospace", resize: "vertical", outline: "none", boxSizing: "border-box" };
