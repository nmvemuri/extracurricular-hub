"use client";
import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { id: "volunteer", label: "Volunteering", icon: "🤝", color: "#2dd4bf" },
  { id: "club", label: "Clubs", icon: "🏛️", color: "#818cf8" },
  { id: "sport", label: "Sports", icon: "⚡", color: "#fb923c" },
  { id: "arts", label: "Arts & Music", icon: "🎨", color: "#f472b6" },
  { id: "stem", label: "STEM", icon: "🔬", color: "#38bdf8" },
  { id: "leadership", label: "Leadership", icon: "🎯", color: "#facc15" },
  { id: "internship", label: "Internships", icon: "💼", color: "#a78bfa" },
  { id: "summer", label: "Summer Programs", icon: "☀️", color: "#4ade80" },
];

const MOCK_OPPORTUNITIES = [
  {
    title: "Austin Habitat for Humanity — Youth Build Program",
    category: "volunteer",
    source: "habitataustin.org",
    description: "Join weekend builds helping construct affordable housing. Great for community service hours and leadership experience.",
    deadline: "Rolling enrollment",
    commitment: "4 hrs/week",
  },
  {
    title: "UT Austin — High School Research Apprenticeship",
    category: "stem",
    source: "utexas.edu",
    description: "Work alongside university researchers in STEM labs. Applications open each spring for summer placements.",
    deadline: "April 15, 2026",
    commitment: "15 hrs/week (summer)",
  },
  {
    title: "Austin Youth Council — City Advisory Board",
    category: "leadership",
    source: "austintexas.gov",
    description: "Advise city council members on youth-related policy. Highly selective — strong for college applications.",
    deadline: "May 1, 2026",
    commitment: "5 hrs/month",
  },
  {
    title: "Long Center — Student Arts Internship",
    category: "arts",
    source: "thelongcenter.org",
    description: "Assist with event production, marketing, and community outreach at Austin's premier performing arts venue.",
    deadline: "March 30, 2026",
    commitment: "8 hrs/week",
  },
  {
    title: "Austin FC — Youth Soccer Development League",
    category: "sport",
    source: "austinfc.com",
    description: "Competitive development league for high school players with coaching from professional staff.",
    deadline: "Tryouts in August",
    commitment: "10 hrs/week",
  },
  {
    title: "Capital Area Food Bank — Student Ambassador",
    category: "volunteer",
    source: "cafbtx.org",
    description: "Lead food drives at your school, organize volunteers, and help distribute meals to families in need.",
    deadline: "Rolling",
    commitment: "3 hrs/week",
  },
  {
    title: "Austin Coding Academy — High School Bootcamp",
    category: "stem",
    source: "austincodingacademy.com",
    description: "Learn full-stack web development in a 10-week intensive program designed for high schoolers.",
    deadline: "June 1, 2026",
    commitment: "12 hrs/week (summer)",
  },
  {
    title: "Debate Austin — Regional Tournament Circuit",
    category: "club",
    source: "debateaustin.org",
    description: "Compete in Lincoln-Douglas and Policy debate across Central Texas. Weekly practice sessions included.",
    deadline: "September enrollment",
    commitment: "6 hrs/week",
  },
];

// ─── Reusable Components ───

function GlowOrb({ color, size, top, left, delay }) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        top,
        left,
        animation: `float ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        pointerEvents: "none",
      }}
    />
  );
}

function CategoryPill({ cat, selected, onClick }) {
  const isActive = selected.includes(cat.id);
  return (
    <button
      onClick={() => onClick(cat.id)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 16px",
        borderRadius: 99,
        border: `1.5px solid ${isActive ? cat.color : "var(--border)"}`,
        background: isActive ? `${cat.color}18` : "var(--card)",
        color: isActive ? cat.color : "var(--text-secondary)",
        fontSize: 13,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 15 }}>{cat.icon}</span>
      {cat.label}
    </button>
  );
}

function ActivityCard({ activity, onDelete }) {
  const cat = CATEGORIES.find((c) => c.id === activity.category) || CATEGORIES[0];
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 20,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 30px ${cat.color}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${cat.color}, ${cat.color}66)`,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>{cat.icon}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: cat.color,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {cat.label}
            </span>
          </div>
          <h3
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "var(--text)",
              margin: 0,
              fontFamily: "'Space Grotesk', sans-serif",
              lineHeight: 1.3,
            }}
          >
            {activity.name}
          </h3>
        </div>
        <button
          onClick={() => onDelete(activity.id)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: 18,
            padding: 4,
            lineHeight: 1,
            borderRadius: 6,
          }}
          title="Remove activity"
        >
          ×
        </button>
      </div>
      {activity.description && (
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            margin: "10px 0 0",
            lineHeight: 1.5,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {activity.description}
        </p>
      )}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 14,
          fontSize: 12,
          color: "var(--text-muted)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {activity.hours && (
          <span>
            🕐 {activity.hours} hrs/week
          </span>
        )}
        {activity.role && (
          <span>
            👤 {activity.role}
          </span>
        )}
      </div>
    </div>
  );
}

function OpportunityCard({ opp, onAdd }) {
  const cat = CATEGORIES.find((c) => c.id === opp.category) || CATEGORIES[0];
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 20,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 30px ${cat.color}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${cat.color}, transparent)`,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 15 }}>{cat.icon}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: cat.color,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {cat.label}
            </span>
            <span
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                fontFamily: "'DM Sans', sans-serif",
                marginLeft: "auto",
                marginRight: 8,
              }}
            >
              via {opp.source}
            </span>
          </div>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--text)",
              margin: 0,
              fontFamily: "'Space Grotesk', sans-serif",
              lineHeight: 1.3,
            }}
          >
            {opp.title}
          </h3>
        </div>
        <button
          onClick={() => onAdd(opp)}
          style={{
            background: `${cat.color}18`,
            border: `1.5px solid ${cat.color}44`,
            color: cat.color,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            padding: "6px 14px",
            borderRadius: 99,
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = cat.color;
            e.currentTarget.style.color = "#000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `${cat.color}18`;
            e.currentTarget.style.color = cat.color;
          }}
        >
          + Add
        </button>
      </div>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          margin: "10px 0 0",
          lineHeight: 1.55,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {opp.description}
      </p>
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 14,
          fontSize: 12,
          color: "var(--text-muted)",
          fontFamily: "'DM Sans', sans-serif",
          flexWrap: "wrap",
        }}
      >
        <span>📅 {opp.deadline}</span>
        <span>⏱️ {opp.commitment}</span>
      </div>
    </div>
  );
}

// ─── Insights Panel ───

function InsightsPanel({ activities }) {
  const categoryCounts = {};
  CATEGORIES.forEach((c) => {
    categoryCounts[c.id] = activities.filter((a) => a.category === c.id).length;
  });
  const totalHours = activities.reduce((sum, a) => sum + (parseFloat(a.hours) || 0), 0);
  const filledCategories = Object.values(categoryCounts).filter((c) => c > 0).length;

  const gaps = CATEGORIES.filter((c) => categoryCounts[c.id] === 0);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, var(--card) 0%, #1a1a2e 100%)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "var(--text)",
          margin: "0 0 18px",
          fontFamily: "'Space Grotesk', sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 20 }}>📊</span> Your Profile Insights
      </h3>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Activities", value: activities.length, color: "#818cf8" },
          { label: "Hrs/Week", value: totalHours, color: "#2dd4bf" },
          { label: "Categories", value: `${filledCategories}/8`, color: "#fb923c" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: "1 1 80px",
              background: `${stat.color}10`,
              border: `1px solid ${stat.color}25`,
              borderRadius: 12,
              padding: "12px 14px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: stat.color,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontFamily: "'DM Sans', sans-serif",
                marginTop: 2,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Gap analysis */}
      {activities.length > 0 && gaps.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-secondary)",
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 8,
            }}
          >
            💡 Consider exploring:
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {gaps.slice(0, 4).map((g) => (
              <span
                key={g.id}
                style={{
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 99,
                  background: `${g.color}12`,
                  color: g.color,
                  fontFamily: "'DM Sans', sans-serif",
                  border: `1px solid ${g.color}20`,
                }}
              >
                {g.icon} {g.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {activities.length === 0 && (
        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            fontFamily: "'DM Sans', sans-serif",
            margin: 0,
            textAlign: "center",
            padding: "8px 0",
          }}
        >
          Add activities to see personalized insights
        </p>
      )}
    </div>
  );
}

// ─── Main App ───

export default function ExtracurricularHub() {
  const [tab, setTab] = useState("tracker");
  const [activities, setActivities] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "club",
    description: "",
    hours: "",
    role: "",
  });

  // Opportunity finder state
  const [location, setLocation] = useState("");
  const [selectedCats, setSelectedCats] = useState([]);
  const [searchDone, setSearchDone] = useState(false);
  const [searching, setSearching] = useState(false);
  const [filteredOpps, setFilteredOpps] = useState([]);
  const [toast, setToast] = useState(null);

  const toastTimeout = useRef(null);

  function showToast(message) {
    setToast(message);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(null), 2500);
  }

  function addActivity(data) {
    const newActivity = {
      id: Date.now().toString(),
      ...data,
    };
    setActivities((prev) => [...prev, newActivity]);
    showToast(`Added "${data.name}" to your tracker!`);
  }

  function deleteActivity(id) {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }

  function handleSubmitForm(e) {
    e.preventDefault?.();
    if (!formData.name.trim()) return;
    addActivity({ ...formData });
    setFormData({ name: "", category: "club", description: "", hours: "", role: "" });
    setShowAddForm(false);
  }

  function addFromOpportunity(opp) {
    addActivity({
      name: opp.title,
      category: opp.category,
      description: opp.description,
      hours: opp.commitment.match(/\d+/)?.[0] || "",
      role: "",
    });
  }

 async function handleSearch() {
  if (!location.trim()) return;
  setSearching(true);
  setSearchDone(false);
  try {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, categories: selectedCats }),
    });
    const data = await res.json();
    if (data.opportunities) {
      setFilteredOpps(data.opportunities);
    } else {
      console.error("Search failed:", data.error);
      setFilteredOpps([]);
    }
  } catch (err) {
    console.error("Search error:", err);
    setFilteredOpps([]);
  } finally {
    setSearching(false);
    setSearchDone(true);
  }
}

  function toggleCat(id) {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function detectLocation() {
    setLocation("Austin, TX");
    showToast("Location detected: Austin, TX");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg, #0d0d14)",
        color: "var(--text, #e8e8ed)",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
        "--bg": "#0d0d14",
        "--card": "#161625",
        "--border": "#252540",
        "--text": "#e8e8ed",
        "--text-secondary": "#9999b0",
        "--text-muted": "#5e5e7a",
        "--accent": "#818cf8",
        "--accent-glow": "#818cf822",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        input::placeholder, textarea::placeholder {
          color: #5e5e7a;
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #252540; border-radius: 3px; }
      `}</style>

      {/* Background orbs */}
      <GlowOrb color="#818cf8" size="400px" top="-100px" left="-100px" delay={0} />
      <GlowOrb color="#2dd4bf" size="300px" top="60%" left="80%" delay={2} />
      <GlowOrb color="#f472b6" size="250px" top="30%" left="50%" delay={4} />

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#2dd4bf",
            color: "#0d0d14",
            padding: "10px 24px",
            borderRadius: 99,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 999,
            animation: "toastIn 0.3s ease-out",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 8px 30px #2dd4bf33",
          }}
        >
          {toast}
        </div>
      )}

      {/* Header */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          padding: "32px 24px 0",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                margin: 0,
                fontFamily: "'Space Grotesk', sans-serif",
                background: "linear-gradient(135deg, #818cf8, #2dd4bf)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: -0.5,
              }}
            >
              ExtracurricularHub
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                margin: "4px 0 0",
              }}
            >
              Track activities. Discover opportunities. Build your future.
            </p>
          </div>

          {/* Tab Switcher */}
          <div
            style={{
              display: "flex",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 99,
              padding: 3,
            }}
          >
            {[
              { id: "tracker", label: "My Tracker" },
              { id: "discover", label: "Discover" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 99,
                  border: "none",
                  background: tab === t.id ? "var(--accent)" : "transparent",
                  color: tab === t.id ? "#fff" : "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.25s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 900,
          margin: "0 auto",
          padding: "28px 24px 60px",
        }}
      >
        {/* ─── TRACKER TAB ─── */}
        {tab === "tracker" && (
          <div style={{ animation: "fadeIn 0.4s ease-out" }}>
            <InsightsPanel activities={activities} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "var(--text)",
                  margin: 0,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                My Activities{" "}
                <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                  ({activities.length})
                </span>
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                style={{
                  background: showAddForm ? "#ef444420" : "var(--accent)",
                  color: showAddForm ? "#ef4444" : "#fff",
                  border: showAddForm ? "1.5px solid #ef444444" : "none",
                  padding: "8px 20px",
                  borderRadius: 99,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                {showAddForm ? "Cancel" : "+ Add Activity"}
              </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--accent)33",
                  borderRadius: 20,
                  padding: 24,
                  marginBottom: 20,
                  animation: "slideUp 0.3s ease-out",
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                      Activity Name *
                    </label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Robotics Club, Math Tutoring..."
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text)",
                        fontSize: 14,
                        fontFamily: "'DM Sans', sans-serif",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text)",
                        fontSize: 14,
                        fontFamily: "'DM Sans', sans-serif",
                        outline: "none",
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                      Your Role
                    </label>
                    <input
                      value={formData.role}
                      onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                      placeholder="e.g. President, Member..."
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text)",
                        fontSize: 14,
                        fontFamily: "'DM Sans', sans-serif",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                      Hours/Week
                    </label>
                    <input
                      type="number"
                      value={formData.hours}
                      onChange={(e) => setFormData((p) => ({ ...p, hours: e.target.value }))}
                      placeholder="e.g. 5"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text)",
                        fontSize: 14,
                        fontFamily: "'DM Sans', sans-serif",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                      Description
                    </label>
                    <input
                      value={formData.description}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Brief description for college apps..."
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text)",
                        fontSize: 14,
                        fontFamily: "'DM Sans', sans-serif",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                  <button
                    onClick={handleSubmitForm}
                    disabled={!formData.name.trim()}
                    style={{
                      background: formData.name.trim() ? "var(--accent)" : "var(--border)",
                      color: formData.name.trim() ? "#fff" : "var(--text-muted)",
                      border: "none",
                      padding: "10px 28px",
                      borderRadius: 99,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: formData.name.trim() ? "pointer" : "not-allowed",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.2s",
                    }}
                  >
                    Save Activity
                  </button>
                </div>
              </div>
            )}

            {/* Activity Grid */}
            {activities.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 14,
                }}
              >
                {activities.map((a, i) => (
                  <div key={a.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
                    <ActivityCard activity={a} onDelete={deleteActivity} />
                  </div>
                ))}
              </div>
            ) : (
              !showAddForm && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "var(--text-muted)",
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                  <p style={{ fontSize: 15, margin: "0 0 6px", color: "var(--text-secondary)" }}>
                    No activities yet
                  </p>
                  <p style={{ fontSize: 13, margin: 0 }}>
                    Add your first activity or discover opportunities nearby
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {/* ─── DISCOVER TAB ─── */}
        {tab === "discover" && (
          <div style={{ animation: "fadeIn 0.4s ease-out" }}>
            {/* Search Section */}
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                padding: 24,
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "var(--text)",
                  margin: "0 0 4px",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                🔍 Find Opportunities
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  margin: "0 0 18px",
                }}
              >
                Powered by Gemini — searches across school districts, nonprofits, and community programs
              </p>

              {/* Location input */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your city or zip code..."
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--bg)",
                      color: "var(--text)",
                      fontSize: 14,
                      fontFamily: "'DM Sans', sans-serif",
                      outline: "none",
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <button
                  onClick={detectLocation}
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    padding: "10px 16px",
                    borderRadius: 12,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  📍 Detect
                </button>
                <button
                  onClick={handleSearch}
                  disabled={!location.trim()}
                  style={{
                    background: location.trim() ? "var(--accent)" : "var(--border)",
                    color: location.trim() ? "#fff" : "var(--text-muted)",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: location.trim() ? "pointer" : "not-allowed",
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  Search
                </button>
              </div>

              {/* Category filters */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CATEGORIES.map((c) => (
                  <CategoryPill key={c.id} cat={c} selected={selectedCats} onClick={toggleCat} />
                ))}
              </div>
            </div>

            {/* Loading */}
            {searching && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div
                  style={{
                    display: "inline-flex",
                    gap: 6,
                    alignItems: "center",
                    color: "var(--accent)",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  <span style={{ animation: "pulse 1.2s infinite" }}>●</span>
                  <span style={{ animation: "pulse 1.2s infinite 0.2s" }}>●</span>
                  <span style={{ animation: "pulse 1.2s infinite 0.4s" }}>●</span>
                  <span style={{ marginLeft: 8, color: "var(--text-secondary)" }}>
                    Gemini is searching for opportunities near {location}...
                  </span>
                </div>
              </div>
            )}

            {/* Results */}
            {searchDone && !searching && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--text)",
                      margin: 0,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    Found {filteredOpps.length} opportunities near {location}
                  </h3>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: 14,
                  }}
                >
                  {filteredOpps.map((opp, i) => (
                    <div
                      key={opp.title}
                      style={{ animation: `slideUp 0.4s ease-out ${i * 0.08}s both` }}
                    >
                      <OpportunityCard opp={opp} onAdd={addFromOpportunity} />
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 24,
                    padding: 16,
                    background: "#818cf808",
                    border: "1px solid #818cf818",
                    borderRadius: 14,
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      margin: 0,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    🔮 In production, these results come live from Gemini's grounded search
                    across school districts, VolunteerMatch, local nonprofits, and more.
                  </p>
                </div>
              </div>
            )}

            {!searchDone && !searching && (
              <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-muted)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🌎</div>
                <p style={{ fontSize: 15, margin: "0 0 6px", color: "var(--text-secondary)" }}>
                  Enter your location to discover opportunities
                </p>
                <p style={{ fontSize: 13, margin: 0 }}>
                  We'll search across dozens of sources to find what's near you
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
