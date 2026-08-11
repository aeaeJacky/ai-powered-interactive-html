import { useMemo, useState } from "react";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import MatrixEquationActivity from "./components/MatrixEquationActivity";
import ShareActivityPage from "./components/ShareActivityPage";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clipboard,
  Code2,
  Compass,
  Copy,
  FileText,
  FlaskConical,
  GraduationCap,
  Home,
  Lightbulb,
  Menu,
  MessageSquareText,
  Music2,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Plus,
  Rocket,
  Route,
  Search,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";

type Subject = {
  name: string;
  slug: string;
  short: string;
  color: string;
  soft: string;
};

type Activity = {
  title: string;
  description: string;
  format: string;
  url: string;
};

const subjects: Subject[] = [
  { name: "Chinese Language (中文科)", slug: "chinese", short: "中", color: "#d97965", soft: "#fbeceb" },
  { name: "English Language (英文科)", slug: "english", short: "EN", color: "#4c83b5", soft: "#eaf3fc" },
  { name: "Mathematics (數學科)", slug: "mathematics", short: "∑", color: "#5a9a82", soft: "#e9f6ef" },
  { name: "Citizenship and Social Development (公民與社會發展科)", slug: "csd", short: "CS", color: "#9077b4", soft: "#f1ecf8" },
  { name: "Science (科學科)", slug: "science", short: "SC", color: "#6aa88f", soft: "#e7f3ee" },
  { name: "Mathematics M2 (數學延伸單元二)", slug: "m2", short: "M2", color: "#8a7bb5", soft: "#efeaf8" },
  { name: "Physics (物理科)", slug: "physics", short: "Φ", color: "#c78344", soft: "#fbf0e4" },
  { name: "Chemistry (化學科)", slug: "chemistry", short: "⚗", color: "#4c9d9a", soft: "#e7f5f4" },
  { name: "Biology (生物科)", slug: "biology", short: "♧", color: "#6d9f66", soft: "#edf6ea" },
  { name: "Chinese History (中國歷史科)", slug: "chinese-history", short: "CH", color: "#a0506d", soft: "#f6e9ee" },
  { name: "Geography (地理科)", slug: "geography", short: "GE", color: "#5c8d9f", soft: "#eaf4f6" },
  { name: "Economics (經濟科)", slug: "economics", short: "EC", color: "#7a8b4d", soft: "#f0f4e6" },
  { name: "BAFS (企業、會計與財務概論)", slug: "bafs", short: "BA", color: "#9a7b57", soft: "#f6f0e9" },
  { name: "THS (旅遊與款待)", slug: "ths", short: "TH", color: "#bd718c", soft: "#faedf2" },
  { name: "ICT (資訊及通訊科技)", slug: "ict", short: "</>", color: "#3979b9", soft: "#eaf3fc" },
  { name: "DAT (設計與應用科技)", slug: "dat", short: "DA", color: "#8277b8", soft: "#efedfa" },
  { name: "VA (視覺藝術)", slug: "va", short: "VA", color: "#cb7660", soft: "#fbedeb" },
  { name: "Music (音樂)", slug: "music", short: "♫", color: "#a477ad", soft: "#f4edf7" },
  { name: "Citizenship, Economics and Society (公民、經濟與社會科)", slug: "ces", short: "CE", color: "#7c9a86", soft: "#e9f3ee" },
  { name: "Putonghua (普通話科)", slug: "putonghua", short: "普", color: "#c9895c", soft: "#faf1e8" },
  { name: "Physical Education (體育科)", slug: "pe", short: "PE", color: "#5f9ea8", soft: "#e8f4f5" },
  { name: "Technology and Living (家政科/科技與生活)", slug: "he", short: "TL", color: "#b07a56", soft: "#f6ede6" },
];

const subjectExamples: Record<string, Activity[]> = {
  chinese: [],   english: [{
    title: "Matilda: Find the Words",
    description: "A classroom-friendly word-search game based on Chapters 1 and 2 of Matilda. Students find five hidden vocabulary words across and down the grid.",
    format: "Interactive word search",
    url: "/activities/english/matilda/index.html",
  }, {
    title: "Matilda: What Can You Remember? (p.48)",
    description: "A two-part review activity for Chapters 5 and 6. Students match compound-word pairs in a colour-coded column game, then complete fill-in-the-blank sentences about the story.",
    format: "Matching + fill-in-the-blank",
    url: "/activities/english/matilda/page-48/index.html",
  }], mathematics: [{
    title: "Solving a Matrix Equation Step by Step",
    description: "An animated, self-contained activity that matches corresponding matrix entries and reveals the solution one step at a time.",
    format: "Interactive walkthrough",
    url: "/activities/mathematics/matrix-equation/maths-question.html",
  }], csd: [], science: [], m2: [], physics: [{
    title: "Two Projectiles, One Starting Point",
    description: "An interactive HKAL-style question on resolving velocity components and comparing the horizontal and vertical motion of two launched balls.",
    format: "Interactive multiple choice",
    url: "/activities/physics/projectile-motion/index.html",
  }], chemistry: [], biology: [], bafs: [], ths: [], geography: [], ict: [{
    title: "數據庫規範化：互動教學",
    description: "以廣東話中文講解 database normalization，涵蓋 database 基礎、功能依賴、1NF、2NF、3NF、情境應用，以及互動小測驗。",
    format: "Interactive lesson + quizzes",
    url: "/activities/ict/database-normalization/index.html",
  }], dat: [], va: [], music: [], "chinese-history": [], ces: [], putonghua: [], pe: [], he: [],
};

const activityTypes = ["Interactive quiz", "Matching activity", "Drag and drop", "Flashcards", "Simulation", "Timeline"];
const levels = ["Primary", "Junior secondary", "Senior secondary", "Mixed ability"];
const features = ["Instant feedback", "Progress tracking", "Hint system", "Randomised questions", "Accessible controls"];

function subjectBySlug(slug: string) {
  return subjects.find((subject) => subject.slug === slug);
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [subject, setSubject] = useState("english");
  const [topic, setTopic] = useState("");
  const [activityType, setActivityType] = useState("Interactive quiz");
  const [level, setLevel] = useState("Junior secondary");
  const [selectedFeatures, setSelectedFeatures] = useState(["Instant feedback", "Hint system"]);
  const [copied, setCopied] = useState(false);

  const currentSlug = location.pathname.startsWith("/subject/") ? location.pathname.split("/")[2] : "";
  const currentSubject = subjectBySlug(currentSlug);
  const isBuilder = location.pathname === "/prompt-builder";
  const isShare = location.pathname === "/share";
  const isGettingStarted = location.pathname === "/getting-started";
  const isHome = location.pathname === "/";
  const isMatrixActivity = location.pathname === "/activities/mathematics/matrix-equation" || location.pathname === "/activities/mathematics/matrix-equation/";

  const prompt = useMemo(() => {
    const selectedSubject = subjectBySlug(subject)?.name ?? "English";
    const goal = topic.trim() || "[insert your lesson topic or learning goal]";
    const featureLine = selectedFeatures.length ? selectedFeatures.join(", ") : "clear instructions and responsive design";
    return `Create a self-contained interactive HTML learning activity for ${selectedSubject}.\n\nLearning goal: ${goal}\nLearner level: ${level}\nActivity format: ${activityType}\nKey features: ${featureLine}\n\nRequirements:\n- Use a clear, professional classroom-friendly design.\n- Include concise instructions and meaningful learner feedback.\n- Make the page responsive for desktop and mobile screens.\n- Keep all HTML, CSS, and JavaScript in one file.\n- Do not use external libraries or images unless absolutely necessary.\n- Add a reset button and make keyboard interaction accessible.\n- Return the complete HTML file, followed by a short explanation of how to use it.`;
  }, [subject, topic, activityType, level, selectedFeatures]);

  const navigateTo = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((current) => current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]);
  };

  const copyPrompt = async () => {
    await navigator.clipboard?.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="app-shell">
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "sidebar-mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark"><Sparkles size={17} /></div>
          <div className="sidebar-brand-copy"><strong>ai-powered</strong><span>interactive html</span></div>
          {mobileOpen && <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button>}
        </div>
        <div className="sidebar-section-label">Workspace</div>
        <nav className="primary-nav">
          <NavButton icon={<Home size={16} />} label="Home" selected={isHome} collapsed={collapsed} onClick={() => navigateTo("/")} />
          <NavButton icon={<Route size={16} />} label="Getting Started" selected={isGettingStarted} collapsed={collapsed} onClick={() => navigateTo("/getting-started")} />
          <NavButton icon={<MessageSquareText size={16} />} label="Prompt Builder" selected={isBuilder} collapsed={collapsed} onClick={() => navigateTo("/prompt-builder")} />
          <NavButton icon={<GiftIcon />} label="Share an Activity" selected={isShare} collapsed={collapsed} onClick={() => navigateTo("/share")} />
        </nav>
        <div className="sidebar-section-label subject-label">Subjects</div>
        <nav className="subject-nav">
          {subjects.map((item) => <NavButton key={item.slug} subject={item} label={item.name} selected={currentSlug === item.slug} collapsed={collapsed} onClick={() => navigateTo(`/subject/${item.slug}`)} />)}
        </nav>
        <button className="collapse-button" onClick={() => setCollapsed((value) => !value)} title={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <PanelLeftOpen size={15} /> : <><PanelLeftClose size={15} /><span>Collapse sidebar</span><ChevronLeft size={14} /></>}
        </button>
      </aside>
      <main className={`main-content ${isMatrixActivity ? "activity-main-content" : ""}`}>
        {isMatrixActivity ? <MatrixEquationActivity onBack={() => navigateTo("/subject/mathematics")} /> : <>
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={19} /></button>
          <button className={`sidebar-reopen ${collapsed ? "is-visible" : ""}`} onClick={() => setCollapsed(false)} aria-label="Expand sidebar"><PanelLeftOpen size={18} /></button>
          {!isMatrixActivity && isHome && <HomePage navigateTo={navigateTo} />}
          {isGettingStarted && <GettingStartedPage navigateTo={navigateTo} />}
          {isBuilder && <PromptBuilderPage subject={subject} setSubject={setSubject} topic={topic} setTopic={setTopic} activityType={activityType} setActivityType={setActivityType} level={level} setLevel={setLevel} selectedFeatures={selectedFeatures} toggleFeature={toggleFeature} prompt={prompt} copied={copied} copyPrompt={copyPrompt} />}
          {isShare && <ShareActivityPage onBack={() => navigateTo("/")} />}
          {currentSubject && <SubjectPage subject={currentSubject} activities={subjectExamples[currentSubject.slug] ?? []} navigateTo={navigateTo} />}
        </>}
      </main>
    </div>
  );
}

function GiftIcon() {
  return <span className="nav-icon"><Sparkles size={16} /></span>;
}

function NavButton({ icon, subject, label, selected, collapsed, onClick }: { icon?: React.ReactNode; subject?: Subject; label: string; selected: boolean; collapsed: boolean; onClick: () => void }) {
  return <button className={`nav-button ${selected ? "nav-selected" : ""}`} onClick={onClick} title={collapsed ? label : undefined}>
    {subject ? <span className="subject-icon" style={{ background: subject.soft, color: subject.color }}>{subject.short}</span> : <span className="nav-icon">{icon}</span>}
    <span className="nav-label">{label}</span>{subject && selected && <ChevronRight className="nav-chevron" size={14} />}
  </button>;
}

function PageHeader({ eyebrow, title, description, badge }: { eyebrow: string; title: string; description: string; badge?: string }) {
  return <header className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{badge && <div className="header-badge"><span className="status-dot" />{badge}</div>}</header>;
}

function HomePage({ navigateTo }: { navigateTo: (path: string) => void }) {
  return <div className="page-wrap">
    <PageHeader eyebrow="AI for teaching & learning" title="Make learning interactive." description="A practical space for teachers to explore how AI agents can turn a lesson idea into an engaging, browser-based learning experience." badge="Built for teacher demos" />
    <section className="hero-card">
      <div className="hero-copy"><div className="hero-kicker"><span className="pulse-dot" /> A new way to build</div><h2>From lesson idea<br />to <em>interactive HTML.</em></h2><p>Use an AI agent as your creative partner. Describe what students need to learn, then refine the generated activity until it works for your classroom.</p><div className="hero-actions"><button className="button-primary" onClick={() => navigateTo("/getting-started")}>See how it works <ArrowRight size={15} /></button><button className="button-secondary" onClick={() => navigateTo("/prompt-builder")}><MessageSquareText size={14} /> Build a prompt</button></div></div>
      <div className="hero-visual"><div className="visual-window"><div className="window-bar"><span /><span /><span /><small>interactive-lesson.html</small></div><div className="visual-body"><div className="code-line wide" /><div className="code-line medium" /><div className="demo-card"><div className="mini-icon"><Play size={12} fill="currentColor" /></div><div><strong>Explore the water cycle</strong><small>Interactive simulation</small></div><Check className="demo-check" size={15} /></div><div className="code-line short" /><div className="code-line wide" /></div></div><div className="floating-note"><Lightbulb size={15} /><div><strong>Ready to learn</strong><br />Activity generated with AI</div></div></div>
    </section>
    <section className="home-section"><div className="section-heading"><div><div className="eyebrow">Your starting point</div><h2>Explore the workflow</h2></div><span className="section-count">3 resources</span></div><div className="resource-grid">
      <ResourceCard number="01" icon={<Compass size={17} />} title="Getting Started" description="Understand the simple workflow from a teaching goal to a tested interactive page." action="View the guide" onClick={() => navigateTo("/getting-started")} />
      <ResourceCard number="02" icon={<MessageSquareText size={17} />} title="Prompt Builder" description="Shape a clear, detailed request that gives your AI agent the context it needs." action="Build a prompt" onClick={() => navigateTo("/prompt-builder")} />
      <ResourceCard number="03" icon={<BookOpen size={17} />} title="Activity Gallery" description="Browse subject areas and see how a growing collection of activities can be organised." action="Browse subjects" onClick={() => document.getElementById("subjects")?.scrollIntoView({ behavior: "smooth" })} />
    </div></section>
    <section className="home-section" id="subjects"><div className="section-heading"><div><div className="eyebrow">Teaching areas</div><h2>Browse by subject</h2></div><span className="section-count">22 subjects</span></div><div className="subject-grid">{subjects.map((subject) => <button className="subject-tile" key={subject.slug} onClick={() => navigateTo(`/subject/${subject.slug}`)}><span className="subject-tile-icon" style={{ background: subject.soft, color: subject.color }}>{subject.short}</span>{subject.name}<ArrowUpRight size={14} /></button>)}</div></section>
    <footer className="site-footer"><span>AI-Powered Interactive HTML · Teacher demonstration toolkit</span><span>Designed for exploration and iteration</span></footer>
  </div>;
}

function ResourceCard({ number, icon, title, description, action, onClick }: { number: string; icon: React.ReactNode; title: string; description: string; action: string; onClick: () => void }) {
  return <article className="resource-card"><div className="resource-top"><span className="resource-number">{number}</span><span className="resource-icon">{icon}</span></div><h3>{title}</h3><p>{description}</p><button className="text-link" onClick={onClick}>{action}<ArrowRight size={13} /></button></article>;
}

function SubjectPage({ subject, activities, navigateTo }: { subject: Subject; activities: Activity[]; navigateTo: (path: string) => void }) {
  return <div className="page-wrap"><button className="back-link" onClick={() => navigateTo("/")}><ArrowLeft size={14} /> Back to all subjects</button><PageHeader eyebrow="Subject activity gallery" title={subject.name} description={`A growing collection of interactive HTML examples for ${subject.name}. Use these activities as inspiration for your own classroom ideas.`} badge={`${activities.length} examples`} /><div className="subject-intro" style={{ borderLeftColor: subject.color }}><div><h2>Interactive activities for {subject.name}</h2><p>Examples will be added here as they are created. Each activity can include a preview and a link to open the complete HTML experience.</p></div><div className="gallery-status"><span className="status-dot" /> Ready for examples</div></div>{activities.length ? <div className="activity-grid">{activities.map((activity) => <ActivityCard key={activity.title} activity={activity} />)}</div> : <EmptyGallery subject={subject} navigateTo={navigateTo} />}<div className="add-note"><span className="note-icon"><Plus size={16} /></span><div><strong>Adding a new example</strong><p>Activities are added manually in the site code, so the gallery stays easy to curate for demonstrations.</p></div><Code2 size={17} /></div></div>;
}

function EmptyGallery({ subject, navigateTo }: { subject: Subject; navigateTo: (path: string) => void }) {
  return <div className="empty-gallery"><div className="empty-icon" style={{ color: subject.color, background: subject.soft }}><FileText size={22} /></div><h3>The gallery is ready for its first activity</h3><p>When you create an example for {subject.name}, add it to the <code>subjectExamples</code> collection and it will appear here.</p><button className="button-secondary" onClick={() => navigateTo("/prompt-builder")}><Sparkles size={14} /> Create a prompt for {subject.name}</button></div>;
}

function ActivityCard({ activity }: { activity: Activity }) {
  const internalActivity = activity.url === "/activities/mathematics/matrix-equation/maths-question.html";
  return <article className="activity-card"><div className="activity-preview"><div className="preview-label"><Play size={11} /> Live preview</div><div className="preview-placeholder"><Sparkles size={22} /><span>Interactive preview</span></div></div><div className="activity-info"><div className="activity-format">{activity.format}</div><h3>{activity.title}</h3><p>{activity.description}</p><a className="button-primary" href={internalActivity ? "/activities/mathematics/matrix-equation" : activity.url}>{internalActivity ? "View full activity" : "Open full activity"} <ArrowUpRight size={14} /></a></div></article>;
}

function GettingStartedPage({ navigateTo }: { navigateTo: (path: string) => void }) {
  const steps = [
    ["01", "Choose a subject and learning goal", "Start with the curriculum idea, concept, or skill your students need to practise."],
    ["02", "Describe the learner experience", "Tell the AI agent what students should do: answer, sort, match, explore, or create."],
    ["03", "Generate and test the HTML", "Ask for a self-contained page, open it in a browser, and try the activity as a learner."],
    ["04", "Improve through feedback", "Point out what needs changing. AI agents are especially useful for fast, focused iterations."],
  ];
  return <div className="page-wrap"><PageHeader eyebrow="A practical guide" title="Getting Started" description="A repeatable workflow for turning a teaching idea into an interactive HTML activity with an AI agent." badge="4 simple steps" /><section className="workflow-card"><div className="workflow-list">{steps.map(([number, title, copy], index) => <div className="workflow-step" key={number}><span className="step-number">{number}</span><div className="step-copy"><h3>{title}</h3><p>{copy}</p></div>{index < steps.length - 1 && <span className="step-line" />}</div>)}</div><aside className="workflow-aside"><div className="aside-kicker"><Zap size={14} /> Demo tip</div><h3>Start small, then make it better.</h3><p>Your first prompt does not need to be perfect. A working five-minute activity is a better starting point than a long specification.</p><button className="button-primary" onClick={() => navigateTo("/prompt-builder")}>Try the prompt builder <ArrowRight size={14} /></button></aside></section><section className="tips-section"><div className="section-heading"><div><div className="eyebrow">Prompt-writing tips</div><h2>Give your agent useful context</h2></div></div><div className="tip-grid"><TipCard icon={<Target size={17} />} title="Name the goal" text="Describe what students should know or be able to do at the end of the activity." /><TipCard icon={<Users size={17} />} title="Know your learners" text="Include age, level, language needs, and any accessibility requirements." /><TipCard icon={<Lightbulb size={17} />} title="Specify feedback" text="Ask for hints, explanations, scoring, reset controls, and a clear success state." /></div></section><section className="tips-section"><div className="section-heading"><div><div className="eyebrow">Example brief</div><h2>Make the request concrete</h2></div></div><div className="subject-intro"><div><h2>Example: a mathematics activity</h2><p>“Create a self-contained drag-and-drop activity for junior secondary students to match linear equations with their graphs. Include instant feedback, two hints, a progress counter, and a reset button. Use a calm, professional design and make it work on touch screens.”</p></div><Clipboard size={22} color="#3979b9" /></div></section></div>;
}

function TipCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article className="tip-card"><span className="tip-icon">{icon}</span><h3>{title}</h3><p>{text}</p></article>;
}

function PromptBuilderPage({ subject, setSubject, topic, setTopic, activityType, setActivityType, level, setLevel, selectedFeatures, toggleFeature, prompt, copied, copyPrompt }: { subject: string; setSubject: (value: string) => void; topic: string; setTopic: (value: string) => void; activityType: string; setActivityType: (value: string) => void; level: string; setLevel: (value: string) => void; selectedFeatures: string[]; toggleFeature: (feature: string) => void; prompt: string; copied: boolean; copyPrompt: () => void }) {
  return <div className="page-wrap"><PageHeader eyebrow="Your AI co-pilot" title="Prompt Builder" description="Choose a few details about your lesson. The builder will turn them into a clear starting prompt you can copy into your AI agent." badge="Copyable prompt" /><div className="builder-layout"><section className="builder-form"><div className="form-section"><div className="form-heading"><span>01</span><div><h3>Choose a subject</h3><p>Which curriculum area is this for?</p></div></div><div className="select-grid">{subjects.map((item) => <button key={item.slug} className={`select-chip ${subject === item.slug ? "chip-selected" : ""}`} onClick={() => setSubject(item.slug)}><span style={{ color: item.color }}>{item.short}</span>{item.name}</button>)}</div></div><div className="form-section"><div className="form-heading"><span>02</span><div><h3>Set the learning direction</h3><p>Give your agent the context to design around.</p></div></div><label className="field-label">Topic or learning goal<input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. identify renewable energy sources" /></label><div className="field-row"><label className="field-label">Activity format<select value={activityType} onChange={(event) => setActivityType(event.target.value)}>{activityTypes.map((item) => <option key={item}>{item}</option>)}</select></label><label className="field-label">Learner level<select value={level} onChange={(event) => setLevel(event.target.value)}>{levels.map((item) => <option key={item}>{item}</option>)}</select></label></div></div><div className="form-section"><div className="form-heading"><span>03</span><div><h3>Add useful features</h3><p>Select the details you want included.</p></div></div><div className="feature-list">{features.map((feature) => <button key={feature} className={`feature-toggle ${selectedFeatures.includes(feature) ? "feature-on" : ""}`} onClick={() => toggleFeature(feature)}><span className="checkbox">{selectedFeatures.includes(feature) && <Check size={11} />}</span>{feature}</button>)}</div></div></section><section className="prompt-output"><div className="output-top"><div><div className="eyebrow">Generated prompt</div><h2>Ready to copy</h2></div><div className="output-status"><span className="status-dot" /> Live</div></div><pre>{prompt}</pre><button className="button-primary copy-button" onClick={copyPrompt}>{copied ? <><Check size={15} /> Copied to clipboard</> : <><Copy size={15} /> Copy prompt</>}</button></section></div></div>;
}

export default function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>;
}
