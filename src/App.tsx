import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink,
  Layers,
  Terminal,
  ShieldCheck,
  Zap,
  RefreshCw,
  Upload,
  FileText
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

const DEFAULT_COMMITS: CommitNode[] = [
  { id: 'c1', hash: 'a1b2c3d', message: 'Initial commit: setup base architecture', author: 'Alex', branch: 'main', x: 15, y: 35 },
  { id: 'c2', hash: 'e4f5g6h', message: 'Add authentication middleware', author: 'Sarah', branch: 'main', x: 42, y: 35 },
  { id: 'c3', hash: '7j8k9l0', message: 'Refactor database connection pool', author: 'Alex', branch: 'main', x: 70, y: 35 },
  { id: 'c4', hash: '1m2n3p4', message: 'Start payment gateway integration', author: 'DevUser', branch: 'feature/stripe', x: 42, y: 75 },
  { id: 'c5', hash: '5q6r7s8', message: 'Update webhook listeners and endpoints', author: 'DevUser', branch: 'feature/stripe', x: 70, y: 75, conflict: true },
];

export default function App() {
  const [commits, setCommits] = useState<CommitNode[]>(DEFAULT_COMMITS);
  const [selectedCommit, setSelectedCommit] = useState<CommitNode>(DEFAULT_COMMITS[4]);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'conflict' | 'docs' | 'import'>('visualizer');
  const [copied, setCopied] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState<number>(100);
  const [conflictResolved, setConflictResolved] = useState(false);
  
  // Import state
  const [rawLogInput, setRawLogInput] = useState('');
  const [importError, setImportError] = useState('');

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter commits based on timeline scrubber
  const visibleCommitsCount = Math.max(1, Math.ceil((simulatedTime / 100) * commits.length));
  const visibleCommits = commits.slice(0, visibleCommitsCount);

  // Parse git log text input
  const handleParseGitLog = () => {
    if (!rawLogInput.trim()) {
      setImportError('Please paste a valid git log output.');
      return;
    }

    try {
      const lines = rawLogInput.split('\n').filter(l => l.trim().length > 0);
      const parsedCommits: CommitNode[] = [];
      
      lines.forEach((line, index) => {
        const cleanLine = line.replace(/^[|\*\/\-\s]+/, '');
        const parts = cleanLine.split(' ');
        const hash = parts[0] && parts[0].length >= 7 ? parts[0] : Math.random().toString(36).substring(2, 9);
        const message = parts.slice(1).join(' ') || 'Commit update';
        
        const isBranchB = line.includes('feature') || line.includes('fix') || index % 2 !== 0;
        const xPos = Math.min(15 + (index * 15), 85);
        const yPos = isBranchB ? 75 : 35;

        parsedCommits.push({
          id: `imported-${index}`,
          hash: hash.substring(0, 7),
          message: message,
          author: 'Developer',
          branch: isBranchB ? 'feature/branch' : 'main',
          x: xPos,
          y: yPos,
          conflict: index === lines.length - 1 && lines.length > 2
        });
      });

      if (parsedCommits.length > 0) {
        setCommits(parsedCommits);
        setSelectedCommit(parsedCommits[0]);
        setActiveTab('visualizer');
        setSimulatedTime(100);
        setImportError('');
      } else {
        setImportError('Could not parse any commits. Ensure you use `git log --oneline` format.');
      }
    } catch (err) {
      setImportError('Failed to parse input. Check format.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-[#FFFFFF]">
      {/* Top Editorial Header */}
      <header className="border-b border-[#EAEAEA] bg-[#FFFFFF] px-8 py-5 flex items-center justify-between sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-lg bg-[#111111] text-[#FFFFFF] flex items-center justify-center font-mono font-bold text-sm tracking-wider shadow-sm">
            GW
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-tight">
              Git Warp — Browser Git Topology & Conflict Resolver
            </h1>
            <p className="text-xs text-[#787774] mt-0.5">Visualize branch history instantly & resolve merge conflicts without heavy desktop clients</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <nav className="flex space-x-1 bg-[#F7F6F3] p-1 rounded-lg border border-[#EAEAEA]">
            <button 
              onClick={() => setActiveTab('visualizer')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'visualizer' ? 'bg-[#FFFFFF] text-[#111111] shadow-sm font-semibold' : 'text-[#787774] hover:text-[#111111]'}`}
            >
              Time-Machine Graph
            </button>
            <button 
              onClick={() => setActiveTab('import')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'import' ? 'bg-[#FFFFFF] text-[#111111] shadow-sm font-semibold' : 'text-[#787774] hover:text-[#111111]'}`}
            >
              <Upload className="w-3.5 h-3.5 text-[#1F6C9F]" />
              Import My Repo
            </button>
            <button 
              onClick={() => setActiveTab('conflict')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'conflict' ? 'bg-[#FFFFFF] text-[#111111] shadow-sm font-semibold' : 'text-[#787774] hover:text-[#111111]'}`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#9F2F2D]" />
              Conflict Sandbox
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'docs' ? 'bg-[#FFFFFF] text-[#111111] shadow-sm font-semibold' : 'text-[#787774] hover:text-[#111111]'}`}
            >
              Documentation
            </button>
          </nav>

          <a 
            href="https://github.com/MixBroX/git-warp" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            GitHub Repo
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 flex flex-col gap-6">
        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            {/* Left/Center: Interactive Git Graph Canvas */}
            <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-6 flex flex-col relative shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#EAEAEA]">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-[#787774]" />
                  <h2 className="text-sm font-semibold">Repository Branch Topology & History</h2>
                </div>
                <button 
                  onClick={() => setActiveTab('import')}
                  className="text-xs font-mono text-[#1F6C9F] hover:underline flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" /> Load custom git log
                </button>
              </div>

              {/* Simulated Git Graph Canvas Area */}
              <div className="flex-1 bg-[#FBFBFA] border border-[#EAEAEA] rounded-lg relative min-h-[420px] p-6 flex items-center justify-center overflow-hidden">
                {/* SVG Connecting Lines between visible commits */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '420px' }}>
                  {visibleCommits.map((c, i) => {
                    if (i === 0) return null;
                    const prev = visibleCommits[i - 1];
                    const strokeColor = c.branch.includes('stripe') || c.y === 75 ? '#1F6C9F' : '#346538';
                    return (
                      <line 
                        key={`line-${c.id}`}
                        x1={`${prev.x}%`} 
                        y1={`${prev.y}%`} 
                        x2={`${c.x}%`} 
                        y2={`${c.y}%`} 
                        stroke={strokeColor} 
                        strokeWidth="2.5" 
                        strokeDasharray={c.branch !== prev.branch ? "4" : undefined}
                      />
                    );
                  })}
                  {/* Branch branch connector if both main and feature exist */}
                  {visibleCommits.some(c => c.y === 75) && visibleCommits.some(c => c.y === 35 && c.x === 42) && (
                    <path 
                      d="M 42% 35% C 42% 55%, 42% 55%, 42% 75%" 
                      fill="none" 
                      stroke="#1F6C9F" 
                      strokeWidth="2.5" 
                      strokeDasharray="4" 
                    />
                  )}
                </svg>

                {/* Commit Nodes */}
                <div className="absolute inset-0 p-6">
                  {visibleCommits.map((c) => {
                    const isSelected = selectedCommit?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCommit(c)}
                        style={{ left: `${c.x}%`, top: `${c.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform hover:scale-110 focus:outline-none z-10"
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-sm transition-all ${
                          isSelected 
                            ? 'bg-[#111111] border-[#111111] text-[#FFFFFF] ring-4 ring-[#111111]/10' 
                            : c.conflict 
                              ? 'bg-[#FDF3F2] border-[#9F2F2D] text-[#9F2F2D]' 
                              : 'bg-[#FFFFFF] border-[#D0D0CD] text-[#111111] hover:border-[#111111]'
                        }`}>
                          {c.conflict ? <AlertTriangle className="w-4 h-4" /> : <GitCommit className="w-4 h-4" />}
                        </div>
                        <div className="absolute top-10 bg-[#FFFFFF] border border-[#EAEAEA] px-2 py-0.5 rounded shadow-sm text-[10px] font-mono whitespace-nowrap opacity-90 group-hover:opacity-100">
                          {c.hash} ({c.branch})
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Scrubber / Simulator Slider */}
              <div className="mt-5 pt-4 border-t border-[#EAEAEA] flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-[#787774] flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-[#111111]" /> Time-Machine Timeline Simulator ({visibleCommits.length} of {commits.length} commits)
                  </span>
                  <span className="font-mono text-[#111111]">{simulatedTime}% of history</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  step="20"
                  value={simulatedTime} 
                  onChange={(e) => setSimulatedTime(Number(e.target.value))}
                  className="w-full accent-[#111111] cursor-pointer"
                />
              </div>
            </div>

            {/* Right: Commit Inspector Panel */}
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA] mb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#787774]" />
                    <h2 className="text-sm font-semibold">Commit Inspector</h2>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F7F6F3] border border-[#EAEAEA] text-[#787774]">
                    {selectedCommit?.branch}
                  </span>
                </div>

                {selectedCommit ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="text-[#787774] block mb-1">Commit Hash & Author</span>
                      <div className="font-mono bg-[#F7F6F3] p-2.5 rounded border border-[#EAEAEA] flex items-center justify-between">
                        <span>{selectedCommit.hash} — <strong className="text-[#111111]">{selectedCommit.author}</strong></span>
                        <button 
                          onClick={() => handleCopyCommand(`git checkout ${selectedCommit.hash}`)}
                          className="text-[#787774] hover:text-[#111111] transition-colors p-1"
                          title="Copy git checkout command"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-[#346538]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[#787774] block mb-1">Commit Message</span>
                      <p className="font-medium text-[#111111] bg-[#F7F6F3] p-2.5 rounded border border-[#EAEAEA]">
                        {selectedCommit.message}
                      </p>
                    </div>

                    <div>
                      <span className="text-[#787774] block mb-1">Simulated Code Diff Snapshot</span>
                      <div className="bg-[#111111] text-[#EAEAEA] p-3 rounded font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1">
                        <div className="text-[#787774]">// repository state at {selectedCommit.hash}</div>
                        <div className="text-[#346538]">+ export function initWarpSession() &#123;</div>
                        <div className="text-[#346538]">+   console.log("Warp loaded successfully");</div>
                        <div className="text-[#346538]">+ &#125;</div>
                        <div className="text-[#9F2F2D]">- // legacy wrapper removed</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#787774] italic">Select a commit node from the graph to inspect.</p>
                )}
              </div>

              {/* Quick Checkout CLI Helper */}
              <div className="mt-6 pt-4 border-t border-[#EAEAEA]">
                <span className="text-[11px] text-[#787774] block mb-2">Quick Checkout Command</span>
                <div className="bg-[#F7F6F3] border border-[#EAEAEA] p-2.5 rounded flex items-center justify-between font-mono text-xs">
                  <span className="text-[#111111] truncate">git checkout {selectedCommit?.hash}</span>
                  <button 
                    onClick={() => handleCopyCommand(`git checkout ${selectedCommit?.hash}`)}
                    className="ml-2 bg-[#111111] text-[#FFFFFF] px-2.5 py-1 rounded text-[10px] hover:bg-[#333333] transition-colors flex items-center gap-1 shrink-0"
                  >
                    {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-8 max-w-3xl mx-auto w-full shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#1F6C9F]/10 text-[#1F6C9F] flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold">Import Your Own Git Repository Log</h2>
                <p className="text-xs text-[#787774]">Visualize your personal project history instantly in the browser.</p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-xs font-medium text-[#787774] mb-1.5">
                  Step 1: Run this command in your local terminal inside any git repo:
                </label>
                <div className="bg-[#111111] text-[#EAEAEA] p-3 rounded font-mono text-xs flex items-center justify-between">
                  <span>git log --oneline --all -n 25</span>
                  <button 
                    onClick={() => handleCopyCommand('git log --oneline --all -n 25')}
                    className="text-[#EAEAEA] hover:text-[#FFFFFF]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#787774] mb-1.5">
                  Step 2: Paste the output below:
                </label>
                <textarea 
                  rows={8}
                  value={rawLogInput}
                  onChange={(e) => setRawLogInput(e.target.value)}
                  placeholder="e.g.&#10;a1b2c3d Fix authentication token expiry bug&#10;e4f5g6h Merge pull request #12 from main&#10;7j8k9l0 Add initial dashboard layout"
                  className="w-full bg-[#F7F6F3] border border-[#EAEAEA] rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>

              {importError && (
                <div className="p-3 bg-[#FDF3F2] border border-[#9F2F2D]/20 text-[#9F2F2D] rounded-lg text-xs">
                  {importError}
                </div>
              )}

              <button 
                onClick={handleParseGitLog}
                className="w-full py-2.5 bg-[#111111] text-[#FFFFFF] rounded-lg text-xs font-medium hover:bg-[#333333] transition-colors shadow-sm"
              >
                Parse & Visualize Git Topology
              </button>
            </div>
          </div>
        )}

        {activeTab === 'conflict' && (
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-8 max-w-4xl mx-auto w-full shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EAEAEA]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#9F2F2D]/10 text-[#9F2F2D] flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold">Interactive Merge Conflict Sandbox</h2>
                  <p className="text-xs text-[#787774]">Simulate resolving real-world git conflicts without touching the command line.</p>
                </div>
              </div>
              <span className={`text-xs font-mono px-3 py-1 rounded-full border ${conflictResolved ? 'bg-[#346538]/10 text-[#346538] border-[#346538]/20' : 'bg-[#9F2F2D]/10 text-[#9F2F2D] border-[#9F2F2D]/20'}`}>
                {conflictResolved ? 'Conflict Resolved ✓' : 'Conflict Active (HEAD vs feature/stripe)'}
              </span>
            </div>

            <div className="space-y-6">
              {/* Conflict Code Block */}
              <div className="bg-[#111111] text-[#EAEAEA] rounded-lg p-4 font-mono text-xs space-y-2 overflow-x-auto shadow-inner">
                <div className="text-[#787774]">// file: src/services/payment.ts</div>
                <div>export async function processCheckout(cartId: string) &#123;</div>
                
                {conflictResolved ? (
                  <div className="bg-[#346538]/20 p-2 rounded border border-[#346538]/40 text-[#A8D5BA]">
                    &nbsp;&nbsp;return await StripeClient.charges.create(&#123; amount: 1500, currency: 'usd' &#125;);
                  </div>
                ) : (
                  <>
                    <div className="bg-[#9F2F2D]/20 p-2 rounded border border-[#9F2F2D]/40 text-[#F5B7B1] space-y-1">
                      <div>&lt;&lt;&lt;&lt;&lt;&lt;&nbsp;HEAD (main branch)</div>
                      <div>&nbsp;&nbsp;return await LocalGateway.charge(cartId);</div>
                      <div>=======</div>
                      <div>&nbsp;&nbsp;return await StripeClient.charges.create(&#123; amount: 1500, currency: 'usd' &#125;);</div>
                      <div>&gt;&gt;&gt;&gt;&gt;&gt;&nbsp;feature/stripe</div>
                    </div>
                  </>
                )}

                <div>&#125;</div>
              </div>

              {/* Resolution Action Buttons */}
              {!conflictResolved ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setConflictResolved(true)}
                    className="p-4 rounded-lg border border-[#EAEAEA] bg-[#F7F6F3] hover:bg-[#FFFFFF] hover:border-[#111111] transition-all text-left group"
                  >
                    <span className="text-xs font-semibold block text-[#111111] mb-1 group-hover:underline">Accept Incoming (feature/stripe)</span>
                    <span className="text-[11px] text-[#787774] block">Keep Stripe charges implementation and discard HEAD changes.</span>
                  </button>

                  <button 
                    onClick={() => setConflictResolved(true)}
                    className="p-4 rounded-lg border border-[#EAEAEA] bg-[#F7F6F3] hover:bg-[#FFFFFF] hover:border-[#111111] transition-all text-left group"
                  >
                    <span className="text-xs font-semibold block text-[#111111] mb-1 group-hover:underline">Accept Current (HEAD)</span>
                    <span className="text-[11px] text-[#787774] block">Keep LocalGateway charge implementation and discard incoming.</span>
                  </button>
                </div>
              ) : (
                <div className="bg-[#F7F6F3] p-5 rounded-lg border border-[#EAEAEA] flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-[#111111] mb-0.5">Conflict successfully resolved!</h3>
                    <p className="text-[11px] text-[#787774]">Run the following commands in your terminal to commit the resolution:</p>
                  </div>
                  <button 
                    onClick={() => setConflictResolved(false)}
                    className="px-3 py-1.5 bg-[#FFFFFF] border border-[#EAEAEA] hover:border-[#111111] text-xs font-medium rounded-md transition-colors"
                  >
                    Reset Sandbox
                  </button>
                </div>
              )}

              {conflictResolved && (
                <div className="bg-[#111111] text-[#EAEAEA] p-3 rounded-lg font-mono text-xs flex items-center justify-between">
                  <span>git add . &amp;&amp; git commit -m "fix: resolve merge conflict with stripe gateway"</span>
                  <button 
                    onClick={() => handleCopyCommand('git add . && git commit -m "fix: resolve merge conflict with stripe gateway"')}
                    className="bg-[#333333] hover:bg-[#444444] text-[#FFFFFF] px-2.5 py-1 rounded text-[10px] transition-colors flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-8 max-w-3xl mx-auto w-full shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
            <div>
              <h2 className="text-base font-semibold mb-1">Git Warp Documentation & CLI Guides</h2>
              <p className="text-xs text-[#787774]">Master frictionless Git visualization and conflict resolution.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-[#F7F6F3] border border-[#EAEAEA] space-y-2">
                <h3 className="font-semibold text-[#111111]">1. Exporting Your Git Log</h3>
                <p className="text-[#787774]">To inspect any private repository, run the following command in your terminal and paste the output into the <strong>Import My Repo</strong> tab:</p>
                <div className="bg-[#111111] text-[#EAEAEA] p-2.5 rounded font-mono text-[11px]">
                  git log --oneline --all -n 30 --graph
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#F7F6F3] border border-[#EAEAEA] space-y-2">
                <h3 className="font-semibold text-[#111111]">2. Privacy & Security</h3>
                <p className="text-[#787774]">Git Warp is a 100% client-side Single Page Application (SPA). Your code, logs, and commit messages never leave your browser memory and are never transmitted to external servers.</p>
              </div>

              <div className="p-4 rounded-lg bg-[#F7F6F3] border border-[#EAEAEA] space-y-2">
                <h3 className="font-semibold text-[#111111]">3. Built for Indie Hackers</h3>
                <p className="text-[#787774]">Designed with a Premium Utilitarian Minimalism aesthetic (Linear / Vercel style) to solve daily friction without heavy desktop software.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAEAEA] bg-[#FFFFFF] px-8 py-4 text-center text-xs text-[#787774] flex items-center justify-between">
        <span>Git Warp © 2026 — Zero-dependency client-side Git history topology</span>
        <span className="font-mono text-[11px]">v1.0.0-stable</span>
      </footer>
    </div>
  );
}
