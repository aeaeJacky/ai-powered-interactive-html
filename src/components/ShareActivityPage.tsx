import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Gift,
  Heart,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

const subjectOptions: string[] = [
  "Chinese Language (中文科)", "English Language (英文科)", "Mathematics (數學科)",
  "Citizenship and Social Development (公民與社會發展科)", "Science (科學科)",
  "Mathematics M2 (數學延伸單元二)", "Physics (物理科)", "Chemistry (化學科)",
  "Biology (生物科)", "Chinese History (中國歷史科)", "Geography (地理科)", "Economics (經濟科)",
  "BAFS (企業、會計與財務概論)", "THS (旅遊與款待)", "ICT (資訊及通訊科技)",
  "DAT (設計與應用科技)", "VA (視覺藝術)", "Music (音樂)",
  "Citizenship, Economics and Society (公民、經濟與社會科)", "Putonghua (普通話科)",
  "Physical Education (體育科)", "Technology and Living (家政科/科技與生活)",
];

type Contributor = {
  name: string;
  subject?: string;
  activity?: string;
};

// Contributor credits are stored here. When an activity submission is reviewed
// and accepted, add the contributor to this list so they are publicly acknowledged.
const contributors: Contributor[] = [];

export default function ShareActivityPage({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [html, setHtml] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!name.trim() || !title.trim() || !html.trim()) {
      setStatus("error");
      setMessage("Please fill in your name, an activity title, and paste your HTML.");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/submit-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contributor: name, email, subject, title, description, html }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("done");
        setMessage("Thanks! Your submission has been recorded. The team will review it before it goes live.");
        setName(""); setEmail(""); setTitle(""); setDescription(""); setHtml("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Please try again.");
    }
  };

  return (
    <div className="page-wrap">
      <button className="back-link" onClick={onBack}>
        Back
      </button>
      <div className="section-heading">
        <div>
          <div className="eyebrow">Contribute to the gallery</div>
          <h1>Share an activity</h1>
          <p>
            Built an interactive HTML lesson you are proud of? Paste it here to submit it
            for review. Once approved it will be added to the subject gallery with your
            name credited.
          </p>
        </div>
        <span className="section-count">Reviewed before going live</span>
      </div>

      <div className="builder-layout">
        <section className="builder-form">
          <div className="form-section">
            <div className="form-heading">
              <span>01</span>
              <div>
                <h3>About you</h3>
                <p>So we can credit you as the contributor.</p>
              </div>
            </div>
            <label className="field-label">
              Your name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jane Lo" />
            </label>
            <label className="field-label">
              Email (optional)
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="so we can reach you" type="email" />
            </label>
          </div>

          <div className="form-section">
            <div className="form-heading">
              <span>02</span>
              <div>
                <h3>About the activity</h3>
                <p>Describe what students do and which subject it belongs to.</p>
              </div>
            </div>
            <label className="field-label">
              Subject
              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                {subjectOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="field-label">
              Activity title
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Solar System Drag-and-Drop" />
            </label>
            <label className="field-label">
              Short description
              <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="One or two sentences for students and teachers" />
            </label>
          </div>

          <div className="form-section">
            <div className="form-heading">
              <span>03</span>
              <div>
                <h3>Your HTML</h3>
                <p>Paste the complete self-contained HTML file.</p>
              </div>
            </div>
            <label className="field-label">
              HTML source
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder='<!DOCTYPE html>…</html>'
                rows={12}
                style={{ fontFamily: "monospace", fontSize: 12 }}
              />
            </label>
          </div>

          {status === "error" && <div className="tip-card" style={{ borderLeftColor: "#c73e3e" }}><p style={{ color: "#c73e3e" }}>{message}</p></div>}
          {status === "done" && <div className="tip-card"><p style={{ color: "#16794c" }}><Check size={14} /> {message}</p></div>}

          <button className="button-primary" onClick={submit} disabled={status === "sending"}>
            {status === "sending" ? "Submitting…" : <><Send size={14} /> Submit for review</>}
          </button>
        </section>

        <aside className="prompt-output">
          <div className="output-top">
            <div>
              <div className="eyebrow">How it works</div>
              <h2>Your credits, safe here</h2>
            </div>
            <div className="output-status"><span className="status-dot" /> Curated</div>
          </div>
          <div className="tip-grid" style={{ gridTemplateColumns: "1fr" }}>
            <TipCard icon={<Gift size={16} />} title="You submit" text="Paste your finished HTML activity — no GitHub or technical setup required." />
            <TipCard icon={<Sparkles size={16} />} title="We review" text="Each submission is checked to confirm it works and looks good on the site." />
            <TipCard icon={<Heart size={16} />} title="You get credit" text="Accepted activities appear in the gallery with your name as the contributor." />
          </div>
        </aside>
      </div>

      <section className="tips-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">With thanks</div>
            <h2>Contributors</h2>
          </div>
          <span className="section-count">{contributors.length} credited</span>
        </div>
        <div className="subject-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {contributors.map((c) => (
            <div className="resource-card" key={c.name}>
              <div className="resource-top">
                <span className="resource-icon"><Users size={16} /></span>
              </div>
              <h3>{c.name}</h3>
              <p>{c.activity ? `${c.activity} · ${c.subject}` : c.subject ?? "Contributor"}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TipCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article className="tip-card"><span className="tip-icon">{icon}</span><h3>{title}</h3><p>{text}</p></article>;
}
