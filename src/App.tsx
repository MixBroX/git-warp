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
  FileText,
  Sun,
  Moon
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
  
  // Theme state: default dark theme
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Tour / Onboarding state (steps 0 to 3)
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  
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
        
        // Let's parse git log formats like:
        // 1. `a1b2c3d Author Name: Commit message`
        // 2. `a1b2c3d (Author Name) Commit message`
        // 3. Standard `a1b2c3d Commit message`
        
        const parts = cleanLine.split(' ');
        const hash = parts[0] && parts[0].length >= 7 ? parts[0] : Math.random().toString(36).substring(2, 9);
        
        let author = 'GitUser';
        let message = parts.slice(1).join(' ');

        // Check if second part contains colon or parenthesis (e.g. "Alex:" or "(Alex)")
        if (parts.length > 2) {
          const secondPart = parts[1];
          if (secondPart.endsWith(':')) {
            author = secondPart.slice(0, -1);
            message = parts.slice(2).join(' ');
          } else if (secondPart.startsWith('(') && secondPart.endsWith(')')) {
            author = secondPart.slice(1, -1);
            message = parts.slice(2).join(' ');
          } else if (!secondPart.startsWith('-') && secondPart.length < 20 && parts.length > 3 && parts[2] === '-') {
            author = secondPart;
            message = parts.slice(3).join(' ');
          }
        }

        if (!message.trim()) {
          message = parts.slice(1).join(' ') || 'Commit update';
        }
        
        const isBranchB = line.toLowerCase().includes('feature') || line.toLowerCase().includes('fix') || line.toLowerCase().includes('branch');
        const totalLines = Math.max(lines.length, 1);
        const xPos = Math.round(10 + (index / Math.max(totalLines - 1, 1)) * 80);
        const yPos = isBranchB ? 75 : 35;

        parsedCommits.push({
          id: `imported-${index}`,
          hash: hash.substring(0, 7),
          message: message,
          author: author,
          branch: isBranchB ? 'feature/branch' : 'main',
          x: xPos,
          y: yPos,
          conflict: false
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

  // Theme color variables mapping (Strict monochrome utilitarian minimalism)
  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#111111] text-[#EAEAEA]' : 'bg-[#F7F6F3] text-[#111111]';
  const bgHeader = isDark ? 'bg-[#1A1A1A] border-[#333333]' : 'bg-[#FFFFFF] border-[#EAEAEA]';
  const cardBg = isDark ? 'bg-[#1A1A1A] border-[#333333]' : 'bg-[#FFFFFF] border-[#EAEAEA]';
  const subBg = isDark ? 'bg-[#222222] border-[#333333]' : 'bg-[#F7F6F3] border-[#EAEAEA]';
  const textMuted = isDark ? 'text-[#999999]' : 'text-[#787774]';
  const borderColor = isDark ? 'border-[#333333]' : 'border-[#EAEAEA]';

  return (
    <div className={`min-h-screen ${bgMain} flex flex-col font-sans selection:bg-[#FFFFFF] selection:text-[#111111] transition-colors`}>
      {/* Top Editorial Header */}
      <header className={`border-b ${bgHeader} px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm`}>
        <div className="flex items-center space-x-3.5">
          <div className={`w-9 h-9 rounded-lg ${isDark ? 'bg-[#FFFFFF] text-[#111111]' : 'bg-[#111111] text-[#FFFFFF]'} flex items-center justify-center font-mono font-bold text-sm tracking-wider shadow-sm`}>
            GW
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-tight">
              Git Warp — Browser Git Topology & Conflict Resolver
            </h1>
            <p className={`text-xs ${textMuted} mt-0.5`}>Visualize branch history instantly & resolve merge conflicts without heavy desktop clients</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <nav className={`flex space-x-1 ${subBg} p-1 rounded-lg border ${borderColor}`}>
            <button 
              onClick={() => setActiveTab('visualizer')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'visualizer' ? (isDark ? 'bg-[#333333] text-[#FFFFFF] shadow-sm font-semibold' : 'bg-[#FFFFFF] text-[#111111] shadow-sm font-semibold') : `${textMuted} hover:text-[#FFFFFF]`}`}
            >
              Time-Machine Graph
            </button>
            <button 
              onClick={() => setActiveTab('import')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'import' ? (isDark ? 'bg-[#333333] text-[#FFFFFF] shadow-sm font-semibold' : 'bg-[#FFFFFF] text-[#111111] shadow-sm font-semibold') : `${textMuted} hover:text-[#FFFFFF]`}`}
            >
              <Upload className="w-3.5 h-3.5" />
              Import My Repo
            </button>
            <button 
              onClick={() => setActiveTab('conflict')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'conflict' ? (isDark ? 'bg-[#333333] text-[#FFFFFF] shadow-sm font-semibold' : 'bg-[#FFFFFF] text-[#111111] shadow-sm font-semibold') : `${textMuted} hover:text-[#FFFFFF]`}`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
              Conflict Sandbox
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'docs' ? (isDark ? 'bg-[#333333] text-[#FFFFFF] shadow-sm font-semibold' : 'bg-[#FFFFFF] text-[#111111] shadow-sm font-semibold') : `${textMuted} hover:text-[#FFFFFF]`}`}
            >
              Documentation
            </button>
          </nav>

          <button 
            onClick={() => { setShowTour(true); setTourStep(0); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md ${subBg} border ${borderColor} hover:border-[#888888] transition-colors shadow-sm`}
            title="Launch Interactive Tour"
          >
            <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
            Quick Tour
          </button>

          <button 
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`p-2 rounded-md ${subBg} border ${borderColor} hover:border-[#888888] transition-colors shadow-sm`}
            title="Toggle Light / Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4" />}
          </button>

          <a 
            href="https://github.com/MixBroX/git-warp" 
            target="_blank" 
            rel="noreferrer"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md ${isDark ? 'bg-[#FFFFFF] text-[#111111] hover:bg-[#EAEAEA]' : 'bg-[#111111] text-[#FFFFFF] hover:bg-[#333333]'} transition-colors shadow-sm`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>
      </header>

      {/* Interactive Tour Modal */}
      {showTour && (
        <div className="fixed inset-0 z-50 bg-[#000000]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${cardBg} border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200`}>
            <div className={`flex items-center justify-between pb-4 border-b ${borderColor}`}>
              <div className="flex items-center gap-3">
                <div className={`px-2 py-1 rounded-md ${isDark ? 'bg-[#333333] text-[#FFFFFF]' : 'bg-[#111111] text-[#FFFFFF]'} font-mono font-bold text-xs tracking-wider shrink-0`}>
                  0{tourStep}/03
                </div>
                <h3 className="font-semibold text-sm">
                  {tourStep === 0 && "Welcome to Git Warp! 🚀"}
                  {tourStep === 1 && "Time-Machine Graph ⏳"}
                  {tourStep === 2 && "Import Your Repo 📥"}
                  {tourStep === 3 && "Merge Conflict Sandbox ⚠️"}
                </h3>
              </div>
              <button 
                onClick={() => setShowTour(false)}
                className={`${textMuted} hover:text-[#FFFFFF] text-xs font-mono p-1`}
              >
                ✕ Skip
              </button>
            </div>

            <div className={`text-xs ${textMuted} leading-relaxed space-y-2.5`}>
              {tourStep === 0 && (
                <>
                  <p className={`text-${isDark ? '[#FFFFFF]' : '[#111111]'} font-medium text-sm`}>Why Git Warp?</p>
                  <p>Developers and indie hackers often need to quickly check branch history or resolve merge conflicts without launching heavy desktop clients like SourceTree or GitKraken.</p>
                  <p><strong>Git Warp</strong> is a lightning-fast, 100% client-side web utility. Your codebase and logs never leave your browser.</p>
                </>
              )}
              {tourStep === 1 && (
                <>
                  <p className={`text-${isDark ? '[#FFFFFF]' : '[#111111]'} font-medium text-sm`}>Interactive Commit Topology</p>
                  <p>On the main tab, you can explore visual branch topology (`main` vs `feature/stripe`).</p>
                  <p>• Click any commit node to inspect its author, hash, and diff snapshot in the <strong>Commit Inspector</strong>.<br/>• Use the time scrubber at the bottom to simulate repository history over time.</p>
                </>
              )}
              {tourStep === 2 && (
                <>
                  <p className={`text-${isDark ? '[#FFFFFF]' : '[#111111]'} font-medium text-sm`}>Import Your Personal Repository</p>
                  <p>Want to visualize your own project? Switch to the <strong>Import My Repo</strong> tab.</p>
                  <p>Run `git log --oneline --all` in your terminal, paste the output, and Git Warp instantly renders your personal branch graph in the browser!</p>
                </>
              )}
              {tourStep === 3 && (
                <>
                  <p className={`text-${isDark ? '[#FFFFFF]' : '[#111111]'} font-medium text-sm`}>Merge Conflict Sandbox</p>
                  <p>Dealing with scary merge conflicts? The <strong>Conflict Sandbox</strong> tab simulates real-world conflicts with standard markers (`&lt;&lt;&lt;&lt;&lt;&lt; HEAD`).</p>
                  <p>Click &quot;Accept Incoming&quot; or &quot;Accept Current&quot; to resolve it instantly and copy ready-to-use terminal commands!</p>
                </>
              )}
            </div>

            <div className={`flex items-center justify-between pt-4 border-t ${borderColor}`}>
              <button 
                onClick={() => setTourStep(Math.max(0, tourStep - 1))}
                disabled={tourStep === 0}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md border ${borderColor} transition-colors ${tourStep === 0 ? 'opacity-40 cursor-not-allowed ' + subBg : 'hover:border-[#888888]'}`}
              >
                Back
              </button>

              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((s) => (
                  <div key={s} className={`w-2 h-2 rounded-full ${tourStep === s ? (isDark ? 'bg-[#FFFFFF]' : 'bg-[#111111]') : (isDark ? 'bg-[#333333]' : 'bg-[#EAEAEA]')}`} />
                ))}
              </div>

              {tourStep < 3 ? (
                <button 
                  onClick={() => setTourStep(tourStep + 1)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md ${isDark ? 'bg-[#FFFFFF] text-[#111111] hover:bg-[#EAEAEA]' : 'bg-[#111111] text-[#FFFFFF] hover:bg-[#333333]'} transition-colors`}
                >
                  Next
                </button>
              ) : (
                <button 
                  onClick={() => setShowTour(false)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md ${isDark ? 'bg-[#FFFFFF] text-[#111111]' : 'bg-[#111111] text-[#FFFFFF]'} transition-colors shadow-sm`}
                >
                  Get Started! 🚀
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 flex flex-col gap-6">
        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left/Center: Interactive Git Graph Canvas */}
            <div className={`${cardBg} border rounded-xl p-6 flex flex-col relative shadow-sm lg:col-span-2`}>
              <div className={`flex items-center justify-between mb-5 pb-4 border-b ${borderColor}`}>
                <div className="flex items-center gap-2">
                  <GitBranch className={`w-4 h-4 ${textMuted}`} />
                  <h2 className="text-sm font-semibold">Repository Branch Topology & History</h2>
                </div>
                <button 
                  onClick={() => setActiveTab('import')}
                  className={`text-xs font-mono ${isDark ? 'text-[#EAEAEA]' : 'text-[#111111]'} hover:underline flex items-center gap-1`}
                >
                  <Upload className="w-3 h-3" /> Load custom git log
                </button>
              </div>

              {/* Simulated Git Graph Canvas Area */}
              <div className={`flex-1 ${isDark ? 'bg-[#141414]' : 'bg-[#FBFBFA]'} border ${borderColor} rounded-lg relative min-h-[420px] p-6 flex items-center justify-center overflow-hidden`}>
                {/* SVG Connecting Lines between visible commits */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '420px' }}>
                  {visibleCommits.map((c, i) => {
                    if (i === 0) return null;
                    const prev = visibleCommits[i - 1];
                    const strokeColor = c.branch.includes('stripe') || c.y === 75 ? (isDark ? '#888888' : '#555555') : (isDark ? '#FFFFFF' : '#111111');
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
                      stroke={isDark ? '#888888' : '#555555'} 
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
                            ? (isDark ? 'bg-[#FFFFFF] border-[#FFFFFF] text-[#111111] ring-4 ring-[#FFFFFF]/10' : 'bg-[#111111] border-[#111111] text-[#FFFFFF] ring-4 ring-[#111111]/10')
                            : c.conflict 
                              ? (isDark ? 'bg-[#3A1D1D] border-[#EF4444] text-[#EF4444]' : 'bg-[#FDF3F2] border-[#EF4444] text-[#EF4444]') 
                              : (isDark ? 'bg-[#222222] border-[#555555] text-[#EAEAEA] hover:border-[#FFFFFF]' : 'bg-[#FFFFFF] border-[#D0D0CD] text-[#111111] hover:border-[#111111]')
                        }`}>
                          {c.conflict ? <AlertTriangle className="w-4 h-4" /> : <GitCommit className="w-4 h-4" />}
                        </div>
                        <div className={`absolute top-10 ${cardBg} border px-2 py-0.5 rounded shadow-sm text-[10px] font-mono whitespace-nowrap opacity-90 group-hover:opacity-100`}>
                          {c.hash} ({c.branch})
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Scrubber / Simulator Slider */}
              <div className={`mt-5 pt-4 border-t ${borderColor} flex flex-col gap-2`}>
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-medium ${textMuted} flex items-center gap-1.5`}>
                    <RefreshCw className="w-3.5 h-3.5 text-current" /> Time-Machine Timeline Simulator ({visibleCommits.length} of {commits.length} commits)
                  </span>
                  <span className="font-mono">{simulatedTime}% of history</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  step="20"
                  value={simulatedTime} 
                  onChange={(e) => setSimulatedTime(Number(e.target.value))}
                  className={`w-full cursor-pointer ${isDark ? 'accent-[#FFFFFF]' : 'accent-[#111111]'}`}
                />
              </div>
            </div>

            {/* Right: Commit Inspector Panel */}
            <div className={`${cardBg} border rounded-xl p-6 flex flex-col justify-between shadow-sm`}>
              <div>
                <div className={`flex items-center justify-between pb-4 border-b ${borderColor} mb-4`}>
                  <div className="flex items-center gap-2">
                    <Terminal className={`w-4 h-4 ${textMuted}`} />
                    <h2 className="text-sm font-semibold">Commit Inspector</h2>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${subBg} border ${borderColor} ${textMuted}`}>
                    {selectedCommit?.branch}
                  </span>
                </div>

                {selectedCommit ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <span className={`${textMuted} block mb-1`}>Commit Hash & Author</span>
                      <div className={`font-mono ${subBg} p-2.5 rounded border ${borderColor} flex items-center justify-between`}>
                        <span>{selectedCommit.hash} — <strong className={isDark ? 'text-[#FFFFFF]' : 'text-[#111111]'}>{selectedCommit.author}</strong></span>
                        <button 
                          onClick={() => handleCopyCommand(`git checkout ${selectedCommit.hash}`)}
                          className={`${textMuted} hover:text-current transition-colors p-1`}
                          title="Copy git checkout command"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className={`${textMuted} block mb-1`}>Commit Message</span>
                      <p className={`font-medium ${isDark ? 'text-[#FFFFFF]' : 'text-[#111111]'} ${subBg} p-2.5 rounded border ${borderColor}`}>
                        {selectedCommit.message}
                      </p>
                    </div>

                    <div>
                      <span className={`${textMuted} block mb-1`}>Simulated Code Diff Snapshot</span>
                      <div className="bg-[#000000] text-[#EAEAEA] p-3 rounded font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1 border border-[#333333]">
                        <div className="text-[#787774]">diff --git a/src/index.ts b/src/index.ts</div>
                        <div className="text-[#787774]">index {selectedCommit.hash}..9f66f93 100644</div>
                        <div className="text-[#888888]">--- a/src/index.ts</div>
                        <div className="text-[#888888]">+++ b/src/index.ts</div>
                        <div className="text-[#666666]">@@ -12,4 +12,6 @@</div>
                        <div className="text-[#EF4444]">- // author: {selectedCommit.author} (legacy state)</div>
                        <div className="text-[#EF4444]">- const activeWarp = false;</div>
                        <div className="text-[#10B981]">+ // commit: {selectedCommit.message}</div>
                        <div className="text-[#10B981]">+ export const commitHash = "{selectedCommit.hash}";</div>
                        <div className="text-[#10B981]">+ export const authorName = "{selectedCommit.author}";</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className={`text-xs ${textMuted} italic`}>Select a commit node from the graph to inspect.</p>
                )}
              </div>

              {/* Quick Checkout CLI Helper */}
              <div className={`mt-6 pt-4 border-t ${borderColor}`}>
                <span className={`text-[11px] ${textMuted} block mb-2`}>Quick Checkout Command</span>
                <div className={`${subBg} border ${borderColor} p-2.5 rounded flex items-center justify-between font-mono text-xs`}>
                  <span className="truncate">git checkout {selectedCommit?.hash}</span>
                  <button 
                    onClick={() => handleCopyCommand(`git checkout ${selectedCommit?.hash}`)}
                    className={`ml-2 ${isDark ? 'bg-[#FFFFFF] text-[#111111] hover:bg-[#EAEAEA]' : 'bg-[#111111] text-[#FFFFFF] hover:bg-[#333333]'} px-2.5 py-1 rounded text-[10px] transition-colors flex items-center gap-1 shrink-0`}
                  >
                    {copied ? <><Check className="w-3 h-3 text-[#10B981]" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div className={`${cardBg} border rounded-xl p-8 max-w-3xl mx-auto w-full shadow-sm`}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-8 h-8 rounded-lg ${subBg} flex items-center justify-center`}>
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold">Import Your Own Git Repository Log</h2>
                <p className={`text-xs ${textMuted}`}>Visualize your personal project history instantly in the browser.</p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div>
                <label className={`block text-xs font-medium ${textMuted} mb-1.5`}>
                  Step 1: Run this command in your local terminal inside any git repo:
                </label>
                <div className="bg-[#000000] text-[#EAEAEA] p-3 rounded font-mono text-xs flex items-center justify-between border border-[#333333]">
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
                <label className={`block text-xs font-medium ${textMuted} mb-1.5`}>
                  Step 2: Paste the output below:
                </label>
                <textarea 
                  rows={8}
                  value={rawLogInput}
                  onChange={(e) => setRawLogInput(e.target.value)}
                  placeholder="e.g.&#10;a1b2c3d Fix authentication token expiry bug&#10;e4f5g6h Merge pull request #12 from main&#10;7j8k9l0 Add initial dashboard layout"
                  className={`w-full ${subBg} border ${borderColor} rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-[#888888]`}
                />
              </div>

              {importError && (
                <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] rounded-lg text-xs">
                  {importError}
                </div>
              )}

              <button 
                onClick={handleParseGitLog}
                className={`w-full py-2.5 ${isDark ? 'bg-[#FFFFFF] text-[#111111] hover:bg-[#EAEAEA]' : 'bg-[#111111] text-[#FFFFFF] hover:bg-[#333333]'} rounded-lg text-xs font-medium transition-colors shadow-sm`}
              >
                Parse & Visualize Git Topology
              </button>
            </div>
          </div>
        )}

        {activeTab === 'conflict' && (
          <div className={`${cardBg} border rounded-xl p-8 max-w-4xl mx-auto w-full shadow-sm`}>
            <div className={`flex items-center justify-between mb-6 pb-4 border-b ${borderColor}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold">Interactive Merge Conflict Sandbox</h2>
                  <p className={`text-xs ${textMuted}`}>Simulate resolving real-world git conflicts without touching the command line.</p>
                </div>
              </div>
              <span className={`text-xs font-mono px-3 py-1 rounded-full border ${conflictResolved ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'}`}>
                {conflictResolved ? 'Conflict Resolved ✓' : 'Conflict Active (HEAD vs feature/stripe)'}
              </span>
            </div>

            <div className="space-y-6">
              {/* Conflict Code Block */}
              <div className="bg-[#000000] text-[#EAEAEA] rounded-lg p-4 font-mono text-xs space-y-2 overflow-x-auto shadow-inner border border-[#333333]">
                <div className="text-[#787774]">// file: src/services/payment.ts</div>
                <div>export async function processCheckout(cartId: string) &#123;</div>
                
                {conflictResolved ? (
                  <div className="bg-[#10B981]/20 p-2 rounded border border-[#10B981]/40 text-[#A8D5BA]">
                    &nbsp;&nbsp;return await StripeClient.charges.create(&#123; amount: 1500, currency: 'usd' &#125;);
                  </div>
                ) : (
                  <>
                    <div className="bg-[#EF4444]/20 p-2 rounded border border-[#EF4444]/40 text-[#F5B7B1] space-y-1">
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
                    className={`p-4 rounded-lg border ${borderColor} ${subBg} hover:bg-[${isDark ? '#262626' : '#FFFFFF'}] hover:border-[#888888] transition-all text-left group`}
                  >
                    <span className={`text-xs font-semibold block ${isDark ? 'text-[#FFFFFF]' : 'text-[#111111]'} mb-1 group-hover:underline`}>Accept Incoming (feature/stripe)</span>
                    <span className={`text-[11px] ${textMuted} block`}>Keep Stripe charges implementation and discard HEAD changes.</span>
                  </button>

                  <button 
                    onClick={() => setConflictResolved(true)}
                    className={`p-4 rounded-lg border ${borderColor} ${subBg} hover:bg-[${isDark ? '#262626' : '#FFFFFF'}] hover:border-[#888888] transition-all text-left group`}
                  >
                    <span className={`text-xs font-semibold block ${isDark ? 'text-[#FFFFFF]' : 'text-[#111111]'} mb-1 group-hover:underline`}>Accept Current (HEAD)</span>
                    <span className={`text-[11px] ${textMuted} block`}>Keep LocalGateway charge implementation and discard incoming.</span>
                  </button>
                </div>
              ) : (
                <div className={`${subBg} p-5 rounded-lg border ${borderColor} flex items-center justify-between`}>
                  <div>
                    <h3 className={`text-xs font-semibold ${isDark ? 'text-[#FFFFFF]' : 'text-[#111111]'} mb-0.5`}>Conflict successfully resolved!</h3>
                    <p className={`text-[11px] ${textMuted}`}>Run the following commands in your terminal to commit the resolution:</p>
                  </div>
                  <button 
                    onClick={() => setConflictResolved(false)}
                    className={`px-3 py-1.5 ${cardBg} border ${borderColor} hover:border-[#888888] text-xs font-medium rounded-md transition-colors`}
                  >
                    Reset Sandbox
                  </button>
                </div>
              )}

              {conflictResolved && (
                <div className="bg-[#000000] text-[#EAEAEA] p-3 rounded-lg font-mono text-xs flex items-center justify-between border border-[#333333]">
                  <span>git add . ; git commit -m "fix: resolve merge conflict with stripe gateway"</span>
                  <button 
                    onClick={() => handleCopyCommand('git add . ; git commit -m "fix: resolve merge conflict with stripe gateway"')}
                    className="bg-[#333333] hover:bg-[#444444] text-[#FFFFFF] px-2.5 py-1 rounded text-[10px] transition-colors flex items-center gap-1"
                  >
                    {copied ? <><Check className="w-3 h-3 text-[#10B981]" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className={`${cardBg} border rounded-xl p-8 max-w-3xl mx-auto w-full shadow-sm space-y-6`}>
            <div>
              <h2 className="text-base font-semibold mb-1">Git Warp Documentation & CLI Guides</h2>
              <p className={`text-xs ${textMuted}`}>Master frictionless Git visualization and conflict resolution.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className={`p-4 rounded-lg ${subBg} border ${borderColor} space-y-2`}>
                <h3 className={`font-semibold ${isDark ? 'text-[#FFFFFF]' : 'text-[#111111]'}`}>1. Exporting Your Git Log</h3>
                <p className={textMuted}>To inspect any private repository, run the following command in your terminal and paste the output into the <strong>Import My Repo</strong> tab:</p>
                <div className="bg-[#000000] text-[#EAEAEA] p-2.5 rounded font-mono text-[11px] border border-[#333333]">
                  git log --oneline --all -n 30 --graph
                </div>
              </div>

              <div className={`p-4 rounded-lg ${subBg} border ${borderColor} space-y-2`}>
                <h3 className={`font-semibold ${isDark ? 'text-[#FFFFFF]' : 'text-[#111111]'}`}>2. Privacy & Security</h3>
                <p className={textMuted}>Git Warp is a 100% client-side Single Page Application (SPA). Your code, logs, and commit messages never leave your browser memory and are never transmitted to external servers.</p>
              </div>

              <div className={`p-4 rounded-lg ${subBg} border ${borderColor} space-y-2`}>
                <h3 className={`font-semibold ${isDark ? 'text-[#FFFFFF]' : 'text-[#111111]'}`}>3. Built for Indie Hackers</h3>
                <p className={textMuted}>Designed with a Premium Utilitarian Minimalism aesthetic (Linear / Vercel style) to solve daily friction without heavy desktop software.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t ${bgHeader} px-8 py-4 text-center text-xs ${textMuted} flex items-center justify-between`}>
        <span>Git Warp © 2026 — Zero-dependency client-side Git history topology</span>
        <span className="font-mono text-[11px]">v1.0.0-stable</span>
      </footer>
    </div>
  );
}
