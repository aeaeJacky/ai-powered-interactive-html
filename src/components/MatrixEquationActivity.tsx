import { useEffect, useState } from "react";
import { ArrowLeft, Pause, Play, RotateCcw } from "lucide-react";

type MatrixStep = {
  title: string;
  text: string;
  cells: string[];
  pairCells?: boolean;
};

const steps: MatrixStep[] = [
  {
    title: "method: compare corresponding entries",
    text: "because A = B, the entries in matching positions are equal. we can solve four small equations.",
    cells: [],
    pairCells: true,
  },
  {
    title: "step 1: compare the top-left entries",
    text: "the top-left entries give 2a = 6. divide both sides by 2: a = 3.",
    cells: ["a1", "b1"],
  },
  {
    title: "step 2: compare the top-right entries",
    text: "a + 2b = 5. replace a with 3: 3 + 2b = 5, so 2b = 2 and b = 1.",
    cells: ["a2", "b2"],
  },
  {
    title: "step 3: compare the bottom-left entries",
    text: "b − c = 7. replace b with 1: 1 − c = 7, so −c = 6 and c = −6.",
    cells: ["a3", "b3"],
  },
  {
    title: "step 4: compare the bottom-right entries",
    text: "d + a = −3. replace a with 3: d + 3 = −3, so d = −6.",
    cells: ["a4", "b4"],
  },
  {
    title: "step 5: check all four values",
    text: "a = 3, b = 1, c = −6 and d = −6. every corresponding entry now matches.",
    cells: [],
    pairCells: true,
  },
];

const pairMap: Record<string, string> = {
  a1: "pair-1",
  b1: "pair-1",
  a2: "pair-2",
  b2: "pair-2",
  a3: "pair-3",
  b3: "pair-3",
  a4: "pair-4",
  b4: "pair-4",
};

const matrixCells = [
  ["a1", "2a"],
  ["a2", "a + 2b"],
  ["a3", "b − c"],
  ["a4", "d + a"],
  ["b1", "6"],
  ["b2", "5"],
  ["b3", "7"],
  ["b4", "−3"],
];

function Matrix({ name, side, currentStep }: { name: string; side: "a" | "b"; currentStep: MatrixStep }) {
  return (
    <div className="matrix-activity-group">
      <span className="matrix-activity-name">{name} =</span>
      <div className="matrix-activity-matrix" aria-label={`matrix ${name}`}>
        {matrixCells.filter(([id]) => id.startsWith(side)).map(([id, value]) => {
          const className = currentStep.pairCells
            ? `matrix-activity-cell ${pairMap[id] ?? ""}`
            : `matrix-activity-cell ${currentStep.cells.includes(id) ? "active" : ""}`;
          return <span className={className} key={id}>{value}</span>;
        })}
      </div>
    </div>
  );
}

export default function MatrixEquationActivity({ onBack }: { onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = steps[currentStep];
  const lastStep = steps.length - 1;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setCurrentStep((value) => {
        if (value >= lastStep) {
          setPlaying(false);
          return value;
        }
        return value + 1;
      });
    }, 2300);
    return () => window.clearInterval(timer);
  }, [playing, lastStep]);

  const goToStep = (value: number) => {
    setPlaying(false);
    setCurrentStep(Math.max(0, Math.min(lastStep, value)));
  };

  const togglePlaying = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (currentStep === lastStep) setCurrentStep(0);
    setPlaying(true);
  };

  return (
    <div className="matrix-activity-page">
      <button className="matrix-activity-back" onClick={onBack}><ArrowLeft size={14} /> Mathematics activities</button>
      <header className="matrix-activity-hero">
        <div className="matrix-activity-container">
          <p className="matrix-activity-kicker">interactive mathematics · matrix equations</p>
          <h1>solve the matrix question step by step</h1>
          <p>match the entries in the same positions, then solve one simple equation at a time.</p>
        </div>
      </header>

      <main className="matrix-activity-main">
        <div className="matrix-activity-container matrix-activity-layout">
          <section className="matrix-activity-card matrix-question-card" aria-labelledby="matrix-question-title">
            <h2 id="matrix-question-title"><span>教學例題 15.1</span><span className="matrix-question-label">15A001</span></h2>
            <p className="matrix-question-text">設 <em>A</em> 及 <em>B</em> 為下列矩陣。若 <em>A = B</em>，求 <em>a</em>、<em>b</em>、<em>c</em> 和 <em>d</em>。</p>
            <div className="matrix-equation-line" aria-label="A equals matrix B">
              <Matrix name="A" side="a" currentStep={step} />
              <span className="matrix-equation-equals">=</span>
              <Matrix name="B" side="b" currentStep={step} />
            </div>
            <div className="matrix-step-progress"><div style={{ width: `${(currentStep / lastStep) * 100}%` }} /></div>
            <div className="matrix-progress-caption"><span>{currentStep === 0 ? "ready to begin" : currentStep === lastStep ? "solution complete" : "working through the equation"}</span><span>step {currentStep} of {lastStep}</span></div>
            <div className="matrix-controls">
              <button onClick={() => goToStep(currentStep - 1)} disabled={currentStep === 0}>← previous</button>
              <button className="matrix-primary-control" onClick={togglePlaying}>{playing ? <><Pause size={14} /> pause solution</> : <><Play size={14} /> play solution</>}</button>
              <button onClick={() => goToStep(currentStep + 1)} disabled={currentStep === lastStep}>next →</button>
              <button onClick={() => goToStep(0)}><RotateCcw size={14} /> restart</button>
            </div>
          </section>

          <aside className="matrix-activity-card matrix-steps-card" aria-labelledby="matrix-steps-title">
            <h2 id="matrix-steps-title">solution steps</h2>
            <ol>
              {steps.map((item, index) => <li className={`${index <= currentStep ? "visible" : ""} ${index === currentStep ? "current" : ""}`} key={item.title}>
                <span>{index + 1}</span><div><strong>{item.title.replace(/^step \d+: /, "")}</strong><small>{index === 0 ? "equal matrices have equal entries in the same position." : item.text}</small></div>
              </li>)}
            </ol>
          </aside>

          <section className="matrix-activity-card matrix-method-card" aria-live="polite">
            <h2>{step.title}</h2>
            <p>{step.text}</p>
            <div className="matrix-answer-grid">{["a = 3", "b = 1", "c = −6", "d = −6"].map((answer) => <div className={currentStep === lastStep ? "show" : ""} key={answer}>{answer}</div>)}</div>
          </section>
        </div>
      </main>
    </div>
  );
}
