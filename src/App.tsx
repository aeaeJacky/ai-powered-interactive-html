import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clipboard,
  Compass,
  FlaskConical,
  GraduationCap,
  Home,
  Lightbulb,
  Menu,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type Subject = {
  key: string;
  name: string;
  short: string;
  color: string;
  tint: string;
};

type Activity = {
  title: string;
  description: string;
  format: string;
  url?: string;
};

const subjects: Subject[] = [
  { key: "chinese", name: "Chinese", short: "中", color: "#c84d4d", tint: "#fff0f0" },
  { key: "english", name: "English", short: "EN", color: "#3979b9", tint: "#edf5ff" },
  { key: "mathematics", name: "Mathematics", short: "∑", color: "#7862b8", tint: "#f2efff" },
  { key: "civic-education", name: "Civic Education", short: "CE", color: "#198f83", tint: "#e9faf7" },
  { key: "physics", name: "Physics", short: "ϕ", color: "#d07838", tint: "#fff5ec" },
  { key: "chemistry", name: "Chemistry", short: "⚗", color: "#407a91", tint: "#edf8fb" },
  { key: "biology", name: "Biology", short: "✣", color: "#4f9862", tint: "#eff9f0" },
  { key: "bafs", name: "BAFS", short: "B", color: "#967226", tint: "#fff8e8" },
  { key: "ths", name: "THS", short: "T", color: "#a05279", tint: "#fff0f7" },
  { key: "geography", name: "Geography", short: "◎", color: "#328b8b", tint: "#eafafa" },
  { key: "ict", name: "ICT", short: "</>", color: "#3c6db5", tint: "#edf3ff" },
  { key: "dat", name: "DAT", short: "D", color: "#7c5a9d", tint: "#f6efff" },
  { key: "va", name: "VA", short: "V", color: "#ba6548", tint: "#fff1ed" },
  { key: "music", name: "Music", short: "♫", color: "#576fa5", tint: "#f0f3ff" },
];

const subjectExamples: Record<string, Activity[]> = Object.fromEntries(
  subjects.map((subject) => [subject.key, []]),
);

const navItems = [
  { key: "home", label: "Home", icon: Home },
  { key: "getting-started", label: "Getting Started", icon: Compass },
  { key: "prompt-builder", label: "Prompt Builder", icon: WandSparkles },
];

const activityTypes = [
  "Interactive quiz",
  "Drag-and-drop activity",
  "Flashcards",
  "Simulation",
  "Matching activity",
  "Interactive timeline",
];

function getSubject(key: string | null) {
  return subjects.find((subject) => subject.key === key) ?? subjects[0];
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentKey = location.pathname.split("/")[1] || "home";
  const activeSubject = subjects.find((subject) => subject.key === currentKey);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const go = (key: string) => navigate(key === "home" ? "/" : `/${key}`);

  return (
    <div className="app-shell">
      <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
        <Menu size={22} />
      </button>
      {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
      <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "sidebar-mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark"><Sparkles size={17} /></div>
          {!collapsed && <div><strong>AI-powered</strong><span>interactive html</span></div>}
          <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={19} /></button>
        </div>
        <div className="sidebar-section-label">Explore</div>
        <nav className="primary-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = currentKey === item.key;
            return <NavButton key={item.key} collapsed={collapsed} label={item.label} icon={<Icon size={18} />} selected={selected} onClick={() => go(item.key)} />;
          })}
        </nav>
        <div className="sidebar-section-label subject-label">Subjects</div>
        <nav className="subject-nav" aria-label="Subject navigation">
          {subjects.map((subject) => (
            <NavButton key={subject.key} collapsed={collapsed} label={subject.name} icon={<span className="subject-icon" style={{ background: subject.tint, color: subject.color }}>{subject.short}</span>} selected={currentKey === subject.key} onClick={() => go(subject.key)} />
          ))}
        </nav>
        <button className="collapse-button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <PanelLeftOpen size={18} /> : <><PanelLeftClose size={18} /><span>Collapse sidebar</span><ArrowLeft size={14} /></>}
        </button>
      </aside>
      <main className={`main-content ${collapsed ? "main-expanded" : ""}`}>
        {activeSubject ? <SubjectPage subject={activeSubject} activities={subjectExamples[activeSubject.key]} onBack={() => go("home")} /> : currentKey === "getting-started" ? <GettingStarted onBuild={() => go("prompt-builder")} /> : currentKey === "prompt-builder" ? <PromptBuilder /> : <HomePage onNavigate={go} />}
      </main>
    </div>
  );
}

function NavButton({ collapsed, label, icon, selected, onClick }: { collapsed: boolean; label: string; icon: React.ReactNode; selected: boolean; onClick: () => void }) {
  return <button className={`nav-button ${selected ? "nav-selected" : ""}`} onClick={onClick} title={collapsed ? label : undefined}><span className="nav-icon">{icon}</span>{!collapsed && <span>{label}</span>}{!collapsed && selected && <ChevronRight size={15} className="nav-chevron" />}</button>;
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</header>;
}

function HomePage({ onNavigate }: { onNavigate: (key: string) => void }) {
  return <div className="page-wrap home-page">
    <PageHeader eyebrow="A practical introduction for teachers" title="Make learning interactive with AI" description="A guided space for exploring how AI agents can help you create engaging, subject-specific HTML learning activities." action={<div className="header-badge"><Sparkles size={16} /> built for teacher demos</div>} />
    <section className="hero-card">
      <div className="hero-copy"><div className="hero-kicker"><span className="pulse-dot" /> AI-assisted lesson design</div><h2>From an idea to an<br /><em>interactive</em> learning page.</h2><p>Discover a simple workflow for turning your teaching ideas into activities that students can explore, practise, and enjoy.</p><div className="hero-actions"><button className="button-primary" onClick={() => onNavigate("getting-started")}>Get started <ArrowRight size={16} /></button><button className="button-secondary" onClick={() => onNavigate("prompt-builder")}><WandSparkles size={16} /> Build a prompt</button></div></div>
      <div className="hero-visual"><div className="visual-window"><div className="window-bar"><span /><span /><span /><small>interactive-learning.html</small></div><div className="visual-body"><div className="code-line wide" /><div className="code-line medium" /><div className="code-line short" /><div className="demo-card"><div className="mini-icon"><Play size={15} fill="currentColor" /></div><div><strong>Try, explore, learn</strong><small>your activity is ready to share</small></div><Check size={18} className="demo-check" /></div><div className="code-line medium" /><div className="code-line wide" /></div></div><div className="floating-note"><Lightbulb size={15} /> <span><strong>small idea</strong><br />big learning moment</span></div></div>
    </section>
    <section className="home-section"><div className="section-heading"><div><div className="eyebrow">Choose your starting point</div><h2>Everything you need for the demo</h2></div><span className="section-count">03 resources</span></div><div className="resource-grid"><ResourceCard number="01" icon={<BookOpen size={20} />} title="Getting Started" text="Follow the complete workflow from teaching idea to tested HTML activity." action="View workflow" onClick={() => onNavigate("getting-started")} /><ResourceCard number="02" icon={<WandSparkles size={20} />} title="Prompt Builder" text="Create a clear, detailed prompt ready to give to your AI agent." action="Build a prompt" onClick={() => onNavigate("prompt-builder")} /><ResourceCard number="03" icon={<GraduationCap size={20} />} title="Subject examples" text="Browse the subject areas and add your own interactive activity examples." action="Browse subjects" onClick={() => document.getElementById("subjects")?.scrollIntoView({ behavior: "smooth" })} /></div></section>
    <section className="home-section subject-overview" id="subjects"><div className="section-heading"><div><div className="eyebrow">Your curriculum, your ideas</div><h2>Explore subject areas</h2></div><span className="section-count">{subjects.length} subjects</span></div><div className="subject-grid">{subjects.map((subject) => <button className="subject-tile" key={subject.key} onClick={() => onNavigate(subject.key)}><span className="subject-tile-icon" style={{ background: subject.tint, color: subject.color }}>{subject.short}</span><span>{subject.name}</span><ChevronRight size={16} /></button>)}</div></section>
    <footer className="site-footer"><span>AI-powered interactive HTML</span><span>Designed for sharing ideas between teachers</span></footer>
  </div>;
}

function ResourceCard({ number, icon, title, text, action, onClick }: { number: string; icon: React.ReactNode; title: string; text: string; action: string; onClick: () => void }) {
  return <article className="resource-card"><div className="resource-top"><span className="resource-number">{number}</span><span className="resource-icon">{icon}</span></div><h3>{title}</h3><p>{text}</p><button className="text-link" onClick={onClick}>{action} <ArrowRight size={14} /></button></article>;
}

function SubjectPage({ subject, activities, onBack }: { subject: Subject; activities: Activity[]; onBack: () => void }) {
  return <div className="page-wrap"><button className="back-link" onClick={onBack}><ArrowLeft size={15} /> Back to home</button><PageHeader eyebrow={`Subject area · ${subject.name}`} title={subject.name} description={`Explore interactive HTML activities for ${subject.name}. New examples can be added here as your collection grows.`} action={<span className="subject-header-icon" style={{ background: subject.tint, color: subject.color }}>{subject.short}</span>} />
    <section className="subject-intro" style={{ borderColor: subject.color }}><div><div className="eyebrow">Activity gallery</div><h2>Ideas to explore and share</h2><p>Use this space to showcase interactive examples made with an AI agent. Select an activity to preview it, then open the full page when you are ready to demonstrate.</p></div><div className="gallery-status"><span className="status-dot" /> {activities.length ? `${activities.length} examples` : "Ready for your first example"}</div></section>
    {activities.length ? <div className="activity-grid">{activities.map((activity) => <ActivityCard key={activity.title} activity={activity} />)}</div> : <div className="empty-gallery"><div className="empty-icon"><FlaskConical size={24} /></div><h3>Your first activity starts here</h3><p>No examples have been added to {subject.name} yet. Add one manually in <code>src/App.tsx</code> when you are ready.</p><button className="button-secondary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Lightbulb size={16} /> See the structure</button></div>}
    <section className="add-note"><div className="note-icon"><MessageSquareText size={19} /></div><div><strong>Adding examples later</strong><p>Keep each activity focused: give it a clear title, a short description, and a link to its full interactive HTML page.</p></div><ArrowRight size={17} /></section>
  </div>;
}

function ActivityCard({ activity }: { activity: Activity }) {
  return <article className="activity-card"><div className="activity-preview"><div className="preview-label"><span className="pulse-dot" /> live preview</div><div className="preview-placeholder"><Play size={22} fill="currentColor" /><span>interactive preview</span></div></div><div className="activity-info"><span className="activity-format">{activity.format}</span><h3>{activity.title}</h3><p>{activity.description}</p>{activity.url ? <a className="button-primary" href={activity.url} target="_blank" rel="noreferrer">Open full activity <ArrowRight size={15} /></a> : <button className="button-secondary" disabled>Full activity coming soon</button>}</div></article>;
}

function GettingStarted({ onBuild }: { onBuild: () => void }) {
  const steps = [
    ["01", "Choose a subject", "Start with the curriculum area and the learning goal you want students to practise."],
    ["02", "Describe the activity", "Tell your AI agent what students should do, what content to include, and how success should look."],
    ["03", "Generate a prompt", "Use the Prompt Builder to turn your idea into a precise brief with useful implementation details."],
    ["04", "Create with an AI agent", "Give the prompt to your preferred AI agent and ask it to produce a self-contained interactive HTML page."],
    ["05", "Test and improve", "Open the page, check the interaction and content, then ask the agent for focused improvements."],
  ];
  return <div className="page-wrap"><PageHeader eyebrow="A simple five-step workflow" title="Getting Started" description="You do not need to be a web developer. Start with your teaching idea, then let an AI agent help shape the first version." action={<div className="header-badge"><Compass size={16} /> your first activity</div>} /><section className="workflow-card"><div className="workflow-list">{steps.map(([number, title, text], index) => <div className="workflow-step" key={number}><div className="step-number">{number}</div><div className="step-copy"><h3>{title}</h3><p>{text}</p></div>{index < steps.length - 1 && <div className="step-line" />}</div>)}</div><div className="workflow-aside"><div className="aside-kicker"><Lightbulb size={16} /> keep it focused</div><h3>One clear learning goal is enough for a great first activity.</h3><p>Begin with a small interaction. You can always add more questions, feedback, or visual polish after the first version works.</p><button className="button-primary" onClick={onBuild}>Build your prompt <ArrowRight size={15} /></button></div></section><section className="tips-section"><div className="section-heading"><div><div className="eyebrow">Prompt-writing tips</div><h2>Help your AI agent help you</h2></div></div><div className="tip-grid"><Tip icon={<TargetIcon />} title="Be specific" text="Name the age group, topic, learning objective, number of questions, and expected interaction." /><Tip icon={<MessageSquareText size={19} />} title="Describe feedback" text="Ask for immediate feedback, a score, hints, or an explanation after each student response." /><Tip icon={<Play size={19} />} title="Ask for a complete page" text="Request a self-contained HTML file that works in a browser without extra setup." /></div></section></div>;
}

function TargetIcon() { return <span className="target-icon">◎</span>; }

function Tip({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <article className="tip-card"><span className="tip-icon">{icon}</span><h3>{title}</h3><p>{text}</p></article>; }

function PromptBuilder() {
  const [subjectKey, setSubjectKey] = useState("english");
  const [topic, setTopic] = useState("");
  const [activityType, setActivityType] = useState(activityTypes[0]);
  const [level, setLevel] = useState("Secondary school");
  const [features, setFeatures] = useState<string[]>(["instant feedback"]);
  const [copied, setCopied] = useState(false);
  const subject = getSubject(subjectKey);
  const featureOptions = ["instant feedback", "score tracking", "hint button", "responsive layout"];
  const prompt = useMemo(() => `Create a self-contained interactive HTML learning activity for ${subject.name}.\n\nTopic: ${topic || "[insert topic]"}\nActivity type: ${activityType}\nLearner level: ${level}\n\nRequirements:\n- Focus on one clear learning objective.\n- Use accurate, age-appropriate ${subject.name} content.\n- Include ${features.length ? features.join(", ") : "clear instructions and a simple completion state"}.\n- Make the page accessible, responsive, and easy to use on a classroom projector.\n- Give immediate, helpful feedback after each interaction.\n- Return one complete HTML file with embedded CSS and JavaScript; do not require external libraries.\n\nBefore finishing, test the interactions and make the visual hierarchy clear for students.`, [subject.name, topic, activityType, level, features]);
  const toggleFeature = (feature: string) => setFeatures((current) => current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]);
  const copyPrompt = async () => { await navigator.clipboard?.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  return <div className="page-wrap"><PageHeader eyebrow="Turn an idea into a clear brief" title="Prompt Builder" description="Choose a few details about your activity. We will assemble a practical prompt you can copy into your AI agent." action={<div className="header-badge"><WandSparkles size={16} /> copy-ready output</div>} /><div className="builder-layout"><section className="builder-form"><div className="form-section"><div className="form-heading"><span>01</span><div><h3>Subject</h3><p>Which curriculum area is this for?</p></div></div><div className="select-grid">{subjects.map((item) => <button className={`select-chip ${subjectKey === item.key ? "chip-selected" : ""}`} key={item.key} onClick={() => setSubjectKey(item.key)}><span style={{ color: item.color }}>{item.short}</span>{item.name}</button>)}</div></div><div className="form-section"><div className="form-heading"><span>02</span><div><h3>Activity details</h3><p>Give the agent enough context to make a useful first version.</p></div></div><label className="field-label">Topic or learning goal<input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. identifying persuasive techniques" /></label><div className="field-row"><label className="field-label">Activity type<select value={activityType} onChange={(event) => setActivityType(event.target.value)}>{activityTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label className="field-label">Learner level<select value={level} onChange={(event) => setLevel(event.target.value)}><option>Primary school</option><option>Secondary school</option><option>Senior secondary</option><option>Mixed ability</option></select></label></div></div><div className="form-section"><div className="form-heading"><span>03</span><div><h3>Useful features</h3><p>Select what you would like the page to include.</p></div></div><div className="feature-list">{featureOptions.map((feature) => <button className={`feature-toggle ${features.includes(feature) ? "feature-on" : ""}`} key={feature} onClick={() => toggleFeature(feature)}><span className="checkbox">{features.includes(feature) && <Check size={13} />}</span>{feature}</button>)}</div></div></section><aside className="prompt-output"><div className="output-top"><div><span className="eyebrow">Your generated prompt</span><h2>Ready to copy</h2></div><span className="output-status"><span className="status-dot" /> live</span></div><pre>{prompt}</pre><button className="button-primary copy-button" onClick={copyPrompt}>{copied ? <Check size={16} /> : <Clipboard size={16} />}{copied ? "Copied to clipboard" : "Copy prompt"}</button></aside></div></div>;
}
