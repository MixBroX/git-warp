import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  GitMerge, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  Terminal, 
  Copy, 
  Check, 
  Coffee, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

interface CommitNode {
  id: string;
  hash: string;
  message: string;
  author: string;
  branch: string;
  x: number;
  y: number;
  conflict?: boolean;
}

const INITIAL_COMMITS: CommitNode[] = [
  { id: 'c1', hash: 'a1b2c3d', message: 'Initial commit: setup base architecture', author: 'Alex', branch: 'main', x: 50, y: 50 },
  { id: 'c2', hash: 'e4f5g6h', message: 'Add authentication middleware', author: 'Sarah', branch: 'main', x: 200, y: 50 },
  { id: 'c3', hash: '7j8k9l0', message: 'Refactor database connection pool', author: 'Alex', branch: 'main', x: 350, y: 50 },
  { id: 'c4', hash: '1m2n3p4', message: 'Start payment gateway integration', author: 'DevUser', branch: 'feature/stripe', x: 200, y: 180 },
  { id: 'c5', hash: '5q6r7s8', message: 'Update webhook listeners and endpoints', author: 'DevUser', branch: 'feature/stripe', x: 350, y: 180, conflict: true },
];

export default function App() {
  const [commits, setCommits] = useState<CommitNode[]>(INITIAL_COMMITS);
  const [selectedCommit, setSelectedCommit] = useState<CommitNode>(INITIAL_COMMITS[4]);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'conflict' | 'docs'>('visualizer');
  const [copied, setCopied] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState<number>(100);

  // Conflict state simulation
  const [conflictResolved, setConflictResolved] = useState(false);

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#111111] flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-[#EAEAEA] bg-[#FFFFFF] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#111111] text-[#FFFFFF] flex items-center justify-center font-mono font-bold text-sm">
            GT
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-tight flex items-center gap-2">
              Git Time-Machine & Conflict Visualizer
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E1F3FE] text-[#1F6C9F] uppercase font-semibold">
                v1.0 Free
              </span>
            </h1>
            <p className="text-xs text-[#787774]">Client-side interactive Git history & merge conflict resolver</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <nav className="flex space-x-1 bg-[#F7F6F3] p-1 rounded-lg border border-[#EAEAEA]">
            <button 
              onClick={() => setActiveTab('visualizer')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'visualizer' ? 'bg-[#FFFFFF] text-[#111111] shadow-sm' : 'text-[#787774] hover:text-[#111111]'}`}
            >
              Time-Machine Graph
            </button>
            <button 
              onClick={() => setActiveTab('conflict')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'conflict' ? 'bg-[#FFFFFF] text-[#111111] shadow-sm' : 'text-[#787774] hover:text-[#111111]'}`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#9F2F2D]" />
              Conflict Sandbox
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'docs' ? 'bg-[#FFFFFF] text-[#111111] shadow-sm' : 'text-[#787774] hover:text-[#111111]'}`}
            >
              CLI & Guide
            </button>
          </nav>

          <a 
            href="https://buymeacoffee.com" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#FBF3DB] text-[#956400] hover:bg-[#f6eaaf] transition-colors border border-[#fae8b4]"
          >
            <Coffee className="w-3.5 h-3.5" />
            Buy me a coffee
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            {/* Left/Center: Interactive Git Graph Canvas */}
            <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-6 flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-[#787774]" />
                  <h2 className="text-sm font-semibold">Repository Branch Topology</h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#787774]">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#346538]"></span> main
                  <span className="inline-block w-2 h-2 rounded-full bg-[#1F6C9F] ml-2"></span> feature/stripe
                </div>
              </div>

              {/* Simulated Git Graph Canvas Area */}
              <div className="flex-1 bg-[#F9F9F8] border border-[#EAEAEA] rounded-lg relative min-h-[380px] p-6 flex items-center justify-center overflow-hidden">
                {/* SVG Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '380px' }}>
                  {/* Main branch line */}
                  <line x1="100" y1="100" x2="250" y2="100" stroke="#346538" strokeWidth="3" strokeDasharray="4" />
                  <line x1="250" y1="100" x2="400" y2="100" stroke="#346538" strokeWidth="3" />
                  
                  {/* Feature branch fork */}
                  <path d="M 250 100 Q 280 100, 280 180 T 400 180" fill="none" stroke="#1F6C9F" strokeWidth="3" />
                  <line x1="400" y1="180" x2="520" y2="180" stroke="#1F6C9F" strokeWidth="3" />
                </svg>

                {/* Commit Nodes */}
                <div className="absolute inset-0 p-6 flex items-center">
                  <div className="relative w-full h-full">
                    {commits.map((c, idx) => {
                      const isSelected = selectedCommit.id === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCommit(c)}
                          style={{ left: `${c.x}%`, top: `${c.y}%` }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform hover:scale-110 focus:outline-none`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-sm transition-all ${
                            c.conflict 
                              ? 'bg-[#FDEBEC] border-[#9F2F2D] text-[#9F2F2D]' 
                              : c.branch === 'main' 
                                ? 'bg-[#EDF3EC] border-[#346538] text-[#346538]' 
                                : 'bg-[#E1F3FE] border-[#1F6C9F] text-[#1F6C9F]'
                          } ${isSelected ? 'ring-4 ring-[#111111]/10 scale-110' : ''}`}>
                            {c.conflict ? <AlertTriangle className="w-4 h-4" /> : <GitCommit className="w-4 h-4" />}
                          </div>
                          <span className="mt-1.5 font-mono text-[10px] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#EAEAEA] text-[#787774] group-hover:text-[#111111]">
                            {c.hash}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Machine Slider Watermark/Control */}
                <div className="absolute bottom-4 left-6 right-6 bg-[#FFFFFF]/90 backdrop-blur border border-[#EAEAEA] p-3 rounded-lg flex items-center gap-4 shadow-sm">
                  <span className="text-xs font-mono font-medium text-[#787774]">Time Scrub:</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={simulatedTime} 
                    onChange={(e) => setSimulatedTime(Number(e.target.value))}
                    className="flex-1 accent-[#111111]"
                  />
                  <span className="text-xs font-mono font-semibold">{simulatedTime}% Timeline State</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-[#787774] flex items-center justify-between">
                <span>Tip: Click any commit node to inspect its diff and snapshot in the time-machine inspector.</span>
                <span className="font-mono">100% Client-Side Processing</span>
              </div>
            </div>

            {/* Right Panel: Commit Details & Time-Machine Inspector */}
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#787774]" />
                    Commit Inspector
                  </h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#F7F6F3] border border-[#EAEAEA]">
                    {selectedCommit.hash}
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-[11px] font-mono text-[#787774] uppercase tracking-wider">Commit Message</label>
                    <p className="text-sm font-medium mt-1">{selectedCommit.message}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono text-[#787774] uppercase tracking-wider">Author</label>
                      <p className="text-xs font-medium mt-1">{selectedCommit.author}</p>
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-[#787774] uppercase tracking-wider">Branch</label>
                      <p className="text-xs font-mono mt-1 text-[#1F6C9F]">{selectedCommit.branch}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#787774] uppercase tracking-wider mb-1 block">Simulated Diff Snapshot</label>
                    <div className="bg-[#111111] text-[#FFFFFF] p-3 rounded-lg font-mono text-xs overflow-x-auto space-y-1">
                      <p className="text-[#787774]"># file: src/payments/stripe.ts</p>
                      <p className="text-[#346538]">+ export async function createCheckoutSession() &#123;</p>
                      <p className="text-[#346538]">+   const stripe = new Stripe(process.env.STRIPE_KEY);</p>
                      <p className="text-[#9F2F2D]">-   // TODO: implement stripe later</p>
                      <p className="text-[#346538]">+   return await stripe.checkout.sessions.create(&#123; ... &#125;);</p>
                      <p className="text-[#346538]">+ &#125;</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#EAEAEA] mt-6">
                <button 
                  onClick={() => handleCopyCommand(`git checkout ${selectedCommit.hash}`)}
                  className="w-full py-2 px-4 rounded-md bg-[#111111] text-[#FFFFFF] text-xs font-medium hover:bg-[#333333] transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Command Copied!' : `Copy git checkout ${selectedCommit.hash}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conflict' && (
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-8 max-w-3xl mx-auto w-full">
            <div className="flex items-center justify-between pb-6 border-b border-[#EAEAEA]">
              <div>
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#9F2F2D]" />
                  Interactive Merge Conflict Sandbox
                </h2>
                <p className="text-xs text-[#787774] mt-1">Simulate how Git markers collide and resolve them visually before applying to your repo.</p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-mono rounded-full font-medium ${conflictResolved ? 'bg-[#EDF3EC] text-[#346538]' : 'bg-[#FDEBEC] text-[#9F2F2D]'}`}>
                {conflictResolved ? 'Resolved Cleanly' : 'Conflict Detected (1)'}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <label className="text-xs font-mono text-[#787774] uppercase tracking-wider block">Conflict Block in <code className="text-[#111111]">src/index.ts</code></label>
              
              <div className="font-mono text-xs bg-[#111111] text-[#FFFFFF] p-4 rounded-lg space-y-2 overflow-x-auto">
                <p className="text-[#787774]">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (main branch)</p>
                <p className="text-[#1F6C9F]">const PORT = process.env.PORT || 3000;</p>
                <p className="text-[#787774]">&#x3d;&#x3d;&#x3d;&#x3d;&#x3d;&#x3d;&#x3d;</p>
                <p className="text-[#346538]">const PORT = Number(process.env.PORT) || 8080;</p>
                <p className="text-[#787774]">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/stripe</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button 
                  onClick={() => setConflictResolved(true)}
                  className="py-2.5 px-4 rounded-md bg-[#EDF3EC] text-[#346538] border border-[#346538]/20 font-medium text-xs hover:bg-[#dcebdd] transition-colors text-left"
                >
                  <strong>Accept Incoming (feature/stripe)</strong>
                  <span className="block text-[11px] opacity-80">Use port 8080 with Number cast</span>
                </button>
                <button 
                  onClick={() => setConflictResolved(true)}
                  className="py-2.5 px-4 rounded-md bg-[#E1F3FE] text-[#1F6C9F] border border-[#1F6C9F]/20 font-medium text-xs hover:bg-[#cceafd] transition-colors text-left"
                >
                  <strong>Accept Current (HEAD)</strong>
                  <span className="block text-[11px] opacity-80">Use port 3000 with fallback</span>
                </button>
              </div>

              {conflictResolved && (
                <div className="mt-6 p-4 rounded-lg bg-[#EDF3EC] border border-[#346538]/20 flex items-center justify-between">
                  <div className="text-xs text-[#346538]">
                    <strong>Success!</strong> Conflict resolved. Run this command to finalize your merge:
                  </div>
                  <button 
                    onClick={() => handleCopyCommand('git add . && git commit -m "fix: resolve port conflict"')}
                    className="px-3 py-1.5 rounded bg-[#346538] text-[#FFFFFF] font-mono text-xs flex items-center gap-1.5 hover:bg-[#2c5530]"
                  >
                    <Copy className="w-3 h-3" /> Copy Resolution CLI
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-8 max-w-3xl mx-auto w-full space-y-6">
            <h2 className="text-base font-semibold">How to use Git Time-Machine</h2>
            <div className="space-y-4 text-sm text-[#787774] leading-relaxed">
              <p>
                Git Time-Machine is designed for developers who want a frictionless, zero-install visualizer for Git branch histories and merge conflicts directly in the browser.
              </p>
              <h3 className="text-sm font-semibold text-[#111111] pt-2">Quick CLI Export</h3>
              <p>
                To generate a compatible branch topology view from your local repository, run the following command in your terminal and paste the output:
              </p>
              <div className="bg-[#111111] text-[#FFFFFF] p-3 rounded-lg font-mono text-xs">
                git log --graph --oneline --all --decorate
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAEAEA] bg-[#FFFFFF] py-6 px-6 text-center text-xs text-[#787774] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          Git Time-Machine • Built with zero dependencies on backend, 100% client-side utility.
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#111111] transition-colors">GitHub</a>
          <span>•</span>
          <a href="https://buymeacoffee.com" target="_blank" rel="noreferrer" className="hover:text-[#111111] transition-colors">Support Project</a>
        </div>
      </footer>
    </div>
  );
}
