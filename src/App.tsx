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
  { id: 'c1', hash: 'a1b2c3d', message: 'Initial commit: setup base architecture', author: 'Alex', branch: 'main', x: 15, y: 30 },
  { id: 'c2', hash: 'e4f5g6h', message: 'Add authentication middleware', author: 'Sarah', branch: 'main', x: 45, y: 30 },
  { id: 'c3', hash: '7j8k9l0', message: 'Refactor database connection pool', author: 'Alex', branch: 'main', x: 75, y: 30 },
  { id: 'c4', hash: '1m2n3p4', message: 'Start payment gateway integration', author: 'DevUser', branch: 'feature/stripe', x: 45, y: 75 },
  { id: 'c5', hash: '5q6r7s8', message: 'Update webhook listeners and endpoints', author: 'DevUser', branch: 'feature/stripe', x: 75, y: 75, conflict: true },
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
        // Simple heuristic to extract hash and message from git log --oneline
        const cleanLine = line.replace(/^[|\*\/\-\s]+/, ''); // remove graph symbols
        const parts = cleanLine.split(' ');
        const hash = parts[0] && parts[0].length >= 7 ? parts[0] : Math.random().toString(36).substring(2, 9);
        const message = parts.slice(1).join(' ') || 'Commit update';
        
        const isBranchB = line.includes('feature') || line.includes('fix') || index % 2 !== 0;
        const xPos = Math.min(15 + (index * 20), 85);
        const yPos = isBranchB ? 75 : 30;

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
            GT
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-tight">
              Git Time-Machine & Conflict Visualizer
            </h1>
            <p className="text-xs text-[#787774] mt-0.5">Frictionless client-side Git history topology & interactive merge conflict resolver</p>
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
            href="https://github.com/MixBroX/git-time-machine" 
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
                {/* SVG Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '420px' }}>
                  <line x1="15%" y1="30%" x2="45%" y2="30%" stroke="#346538" strokeWidth="2.5" strokeDasharray="3" />
                  <line x1="45%" y1="30%" x2="75%" y2="30%" stroke="#346538" strokeWidth="2.5" />
                  <path d="M 45 126 C 45 200, 45 220, 75 315" fill="none" stroke="#1F6C9F" strokeWidth="2.5" strokeDasharray="3" />
                  <line x1="45%" y1="75%" x2="75%" y2="75%" stroke="#1F6C9F" strokeWidth="2.5" />
                </svg>

                {/* Commit Nodes */}
                <div className="absolute inset-0 p-6">
                  {commits.map((c) => {
                    const isSelected = selectedCommit?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCommit(c)}
                        style={{ left: `${c.x}%`, top: `${c.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform hover:scale-110 focus:outline-none"
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-sm transition-all ${
                          c.conflict 
                            ? 'bg-[#FDEBEC] border-[#9F2F2D] text-[#9F2F2D]' 
                            : c.branch === 'main' 
                              ? 'bg-[#EDF3EC] border-[#346538] text-[#346538]' 
                              : 'bg-[#E1F3FE] border-[#1F6C9F] text-[#1F6C9F]'
                        } ${isSelected ? 'ring-4 ring-[#111111]/10 scale-110 shadow-md' : ''}`}>
                          {c.conflict ? <AlertTriangle className="w-4 h-4" /> : <GitCommit className="w-4 h-4" />}
                        </div>
                        <span className="mt-2 font-mono text-[11px] bg-[#FFFFFF] px-2 py-0.5 rounded-md border border-[#EAEAEA] text-[#787774] group-hover:text-[#111111] shadow-xs">
                          {c.hash}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Machine Slider Control */}
                <div className="absolute bottom-5 left-6 right-6 bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EAEAEA] p-3.5 rounded-xl flex items-center gap-4 shadow-sm">
                  <span className="text-xs font-mono font-medium text-[#787774] flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#787774]" style={{ animationDuration: '10s' }} />
                    Time Scrub:
                  </span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={simulatedTime} 
                    onChange={(e) => setSimulatedTime(Number(e.target.value))}
                    className="flex-1 accent-[#111111] h-1.5 bg-[#EAEAEA] rounded-lg cursor-pointer"
                  />
                  <span className="text-xs font-mono font-semibold bg-[#F7F6F3] px-2.5 py-1 rounded border border-[#EAEAEA]">
                    {simulatedTime}% Snapshot
                  </span>
                </div>
              </div>

              <div className="mt-4 text-xs text-[#787774] flex items-center justify-between">
                <span>Tip: Click any commit node to inspect its diff and time-machine snapshot.</span>
                <span className="font-mono flex items-center gap-1 text-[#346538]">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Secured
                </span>
              </div>
            </div>

            {/* Right Panel: Commit Details & Inspector */}
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#787774]" />
                    Commit Inspector
                  </h3>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#F7F6F3] border border-[#EAEAEA] font-semibold">
                    {selectedCommit?.hash || '-------'}
                  </span>
                </div>

                <div className="mt-5 space-y-5">
                  <div>
                    <label className="text-[11px] font-mono text-[#787774] uppercase tracking-wider block mb-1">Commit Message</label>
                    <p className="text-sm font-medium leading-snug">{selectedCommit?.message || 'Select a commit'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-[#F9F9F8] p-3.5 rounded-lg border border-[#EAEAEA]">
                    <div>
                      <label className="text-[10px] font-mono text-[#787774] uppercase tracking-wider block">Author</label>
                      <p className="text-xs font-semibold mt-0.5">{selectedCommit?.author || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-[#787774] uppercase tracking-wider block">Target Branch</label>
                      <p className="text-xs font-mono font-semibold mt-0.5 text-[#1F6C9F]">{selectedCommit?.branch || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#787774] uppercase tracking-wider mb-2 block">Simulated Diff Snapshot</label>
                    <div className="bg-[#111111] text-[#FFFFFF] p-4 rounded-lg font-mono text-xs overflow-x-auto space-y-1 shadow-inner">
                      <p className="text-[#787774]"># file: modified snapshot</p>
                      <p className="text-[#346538]">+ commit {selectedCommit?.hash}</p>
                      <p className="text-[#346538]">+ author: {selectedCommit?.author}</p>
                      <p className="text-[#787774]">... changes applied locally ...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#EAEAEA] mt-6">
                <button 
                  onClick={() => handleCopyCommand(`git checkout ${selectedCommit?.hash}`)}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#111111] text-[#FFFFFF] text-xs font-medium hover:bg-[#333333] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#346538]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Command Copied to Clipboard!' : `Copy git checkout ${selectedCommit?.hash}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-8 max-w-2xl mx-auto w-full shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
            <div className="pb-4 border-b border-[#EAEAEA]">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#1F6C9F]" />
                Import Your Own Repository Logs
              </h2>
              <p className="text-xs text-[#787774] mt-1">
                Run <code className="bg-[#F7F6F3] px-1.5 py-0.5 rounded border border-[#EAEAEA]">git log --oneline --all -n 20</code> in your terminal, paste the output below, and visualize your repo instantly.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#787774] uppercase tracking-wider block mb-2">Paste Git Log Output:</label>
                <textarea 
                  rows={8}
                  value={rawLogInput}
                  onChange={(e) => setRawLogInput(e.target.value)}
                  placeholder="e.g.&#10;a1b2c3d Fix login button bug on mobile&#10;e4f5g6h Add stripe webhook integration&#10;7j8k9l0 Initial release setup"
                  className="w-full p-4 rounded-xl border border-[#EAEAEA] bg-[#FBFBFA] font-mono text-xs focus:outline-none focus:border-[#111111] transition-colors"
                />
              </div>

              {importError && (
                <p className="text-xs text-[#9F2F2D] font-medium">{importError}</p>
              )}

              <button 
                onClick={handleParseGitLog}
                className="w-full py-3 px-4 rounded-xl bg-[#111111] text-[#FFFFFF] text-xs font-medium hover:bg-[#333333] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Generate Interactive Topology Graph
              </button>
            </div>
          </div>
        )}

        {activeTab === 'conflict' && (
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-8 max-w-3xl mx-auto w-full shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between pb-6 border-b border-[#EAEAEA]">
              <div>
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#9F2F2D]" />
                  Interactive Merge Conflict Sandbox
                </h2>
                <p className="text-xs text-[#787774] mt-1">Simulate how Git markers collide and resolve them visually before applying to your repository.</p>
              </div>
              <span className={`px-3 py-1 text-xs font-mono rounded-full font-semibold border ${conflictResolved ? 'bg-[#EDF3EC] text-[#346538] border-[#346538]/20' : 'bg-[#FDEBEC] text-[#9F2F2D] border-[#9F2F2D]/20'}`}>
                {conflictResolved ? 'Resolved Cleanly' : 'Conflict Detected (1)'}
              </span>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-xs font-mono text-[#787774] uppercase tracking-wider block mb-2">Conflict Block in <code className="text-[#111111] bg-[#F7F6F3] px-1.5 py-0.5 rounded border border-[#EAEAEA]">src/index.ts</code></label>
                <div className="font-mono text-xs bg-[#111111] text-[#FFFFFF] p-5 rounded-xl space-y-2 overflow-x-auto shadow-inner">
                  <p className="text-[#787774]">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (main branch)</p>
                  <p className="text-[#1F6C9F]">const PORT = process.env.PORT || 3000;</p>
                  <p className="text-[#787774]">&#x3d;&#x3d;&#x3d;&#x3d;&#x3d;&#x3d;&#x3d;</p>
                  <p className="text-[#346538]">const PORT = Number(process.env.PORT) || 8080;</p>
                  <p className="text-[#787774]">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/stripe</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button 
                  onClick={() => setConflictResolved(true)}
                  className="p-4 rounded-xl bg-[#EDF3EC]/50 hover:bg-[#EDF3EC] text-[#346538] border border-[#346538]/30 font-medium text-xs transition-all text-left shadow-xs group"
                >
                  <strong className="block text-sm font-semibold mb-1 group-hover:underline">Accept Incoming (feature/stripe)</strong>
                  <span className="block text-[11px] text-[#346538]/85">Use port 8080 with explicit Number cast</span>
                </button>
                <button 
                  onClick={() => setConflictResolved(true)}
                  className="p-4 rounded-xl bg-[#E1F3FE]/50 hover:bg-[#E1F3FE] text-[#1F6C9F] border border-[#1F6C9F]/30 font-medium text-xs transition-all text-left shadow-xs group"
                >
                  <strong className="block text-sm font-semibold mb-1 group-hover:underline">Accept Current (HEAD)</strong>
                  <span className="block text-[11px] text-[#1F6C9F]/85">Use default port 3000 with logical OR fallback</span>
                </button>
              </div>

              {conflictResolved && (
                <div className="mt-6 p-5 rounded-xl bg-[#EDF3EC] border border-[#346538]/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                  <div className="text-xs text-[#346538]">
                    <strong className="font-semibold block mb-0.5">Success! Conflict resolved cleanly.</strong>
                    Run this command in your terminal to finalize the merge:
                  </div>
                  <button 
                    onClick={() => handleCopyCommand('git add . && git commit -m "fix: resolve port conflict cleanly"')}
                    className="px-4 py-2 rounded-lg bg-[#346538] text-[#FFFFFF] font-mono text-xs flex items-center gap-2 hover:bg-[#2c5530] transition-colors shadow-sm whitespace-nowrap"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Resolution CLI
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-8 max-w-3xl mx-auto w-full space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#111111]" />
              How Git Time-Machine Works
            </h2>
            <div className="space-y-4 text-sm text-[#787774] leading-relaxed">
              <p>
                Git Time-Machine is built for developers who need an instantaneous, zero-install visualizer for complex Git branch histories and merge conflicts directly in the browser without sending source code to external servers.
              </p>
              <h3 className="text-sm font-semibold text-[#111111] pt-2">Quick CLI Log Export</h3>
              <p>
                To generate a compatible branch topology stream from your local repository, run the standard Git log command in your terminal:
              </p>
              <div className="bg-[#111111] text-[#FFFFFF] p-4 rounded-xl font-mono text-xs shadow-inner">
                git log --graph --oneline --all --decorate
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#EAEAEA] bg-[#FFFFFF] py-6 px-8 text-xs text-[#787774] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#346538]"></span>
          <span>Git Time-Machine • Zero backend dependencies, 100% client-side utility.</span>
        </div>
        <div className="flex items-center gap-6 font-medium">
          <a href="https://github.com/MixBroX/git-time-machine" target="_blank" rel="noreferrer" className="hover:text-[#111111] transition-colors">GitHub Repository</a>
          <span>•</span>
          <span className="text-[#111111]">Open Source Tool</span>
        </div>
      </footer>
    </div>
  );
}
