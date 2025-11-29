import React, { useState, useRef, useEffect } from 'react';
import ParticleBackground from './components/ParticleBackground';
import LoadingOrb from './components/LoadingOrb';
import { PixelMoon, PixelPotion, PixelCrystalBall, PixelSkull } from './components/PixelSymbols';
import { streamDivination } from './services/api';
import { DivinationType, DivinationConfig } from './types';
import { Sparkles, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Constants for UI
const MODES: DivinationConfig[] = [
  {
    id: DivinationType.TAROT,
    name: "塔罗秘境 (Tarot)",
    description: "揭示过去、现在与未来的潜意识指引。",
    icon: "cards",
    color: "from-purple-900 to-indigo-900"
  },
  {
    id: DivinationType.ICHING,
    name: "周易神算 (I Ching)",
    description: "源自东方的古老智慧，解析阴阳变幻。",
    icon: "yin-yang",
    color: "from-slate-800 to-gray-900"
  },
  {
    id: DivinationType.ASTROLOGY,
    name: "星盘解读 (Astrology)",
    description: "聆听星辰的低语，洞察宇宙能量。",
    icon: "star",
    color: "from-blue-900 to-cyan-900"
  },
  {
    id: DivinationType.RUNES,
    name: "卢恩符文 (Runes)",
    description: "北欧奥丁的神谕，直击命运核心。",
    icon: "stone",
    color: "from-emerald-900 to-teal-900"
  }
];

const App: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<DivinationType | null>(null);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const resultContainerRef = useRef<HTMLDivElement>(null);

  const handleModeSelect = (modeId: DivinationType) => {
    setSelectedMode(modeId);
    setResult('');
    setUserInput('');
    setHasStarted(false);
  };

  const handleBack = () => {
    setSelectedMode(null);
    setResult('');
    setHasStarted(false);
  };

  const startDivination = async () => {
    if (!userInput.trim() && selectedMode !== DivinationType.ASTROLOGY) return;
    if (selectedMode === DivinationType.ASTROLOGY && !userInput.trim() && !birthDate) return;

    setIsLoading(true);
    setHasStarted(true);
    setResult('');

    let context = '';
    if (selectedMode === DivinationType.ASTROLOGY && birthDate) {
      context = `用户出生日期: ${birthDate}`;
    }

    try {
      const stream = streamDivination(selectedMode!, userInput, context);
      
      for await (const chunk of stream) {
        setResult(prev => prev + chunk);
      }
    } catch (e) {
      console.error(e);
      setResult("无法连接到以太网...请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resultContainerRef.current) {
      resultContainerRef.current.scrollTop = resultContainerRef.current.scrollHeight;
    }
  }, [result]);

  return (
    <div className="min-h-screen text-slate-200 relative overflow-hidden flex flex-col items-center justify-center font-serif selection:bg-amber-500 selection:text-black">
      <ParticleBackground />
      
      {/* Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat pointer-events-none opacity-20"></div>

      {/* Decorative Floating Pixels */}
      <div className="fixed top-10 left-[5%] animate-float opacity-60 hidden xl:block pointer-events-none z-0">
        <PixelPotion size={100} />
      </div>
      <div className="fixed bottom-20 right-[5%] animate-float opacity-40 hidden xl:block pointer-events-none z-0" style={{ animationDelay: '2s' }}>
        <PixelCrystalBall size={120} />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-2xl px-4 z-10 my-8">
        
        {/* Header Logo */}
        <div 
          className="text-center mb-10 cursor-pointer group" 
          onClick={handleBack}
        >
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-6xl font-pixel font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 pixel-text-shadow tracking-widest group-hover:scale-105 transition-transform duration-300">
              MYSTIC ORACLE
            </h1>
            <div className="absolute -inset-2 bg-amber-500/20 blur-xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity"></div>
          </div>
          <p className="text-amber-200/60 font-cinzel text-sm mt-3 tracking-[0.3em] uppercase">
            Digital Divination System .net
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#050505] border-4 border-[#2a2a2a] shadow-[10px_10px_0_0_rgba(0,0,0,0.8)] relative">
            {/* Corner Decorations */}
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-600"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-amber-600"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-600"></div>

          <div className="p-1 border border-slate-700">
            <div className="bg-[#111] min-h-[500px] p-6 md:p-8 relative overflow-hidden">
                
                {/* Mode Selection */}
                {!selectedMode && (
                  <div className="grid grid-cols-1 gap-6 animate-[fadeIn_0.5s_ease-out]">
                    <div className="text-center mb-4">
                      <p className="font-pixel text-xs text-green-500 mb-2 typewriter">{'>> SYSTEM READY. CHOOSE MODULE:'}</p>
                    </div>
                    {MODES.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => handleModeSelect(mode.id)}
                        className={`group relative h-24 overflow-hidden border-2 border-slate-700 hover:border-amber-500 transition-all duration-300 active:translate-y-1 active:shadow-none shadow-[4px_4px_0_0_#000]`}
                      >
                         <div className={`absolute inset-0 bg-gradient-to-r ${mode.color} opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                         <div className="relative z-10 flex items-center h-full px-6">
                            <div className="font-pixel text-4xl opacity-20 mr-6 text-white group-hover:opacity-100 group-hover:scale-110 transition-all">
                                {mode.id === DivinationType.TAROT && 'I'}
                                {mode.id === DivinationType.ICHING && 'II'}
                                {mode.id === DivinationType.ASTROLOGY && 'III'}
                                {mode.id === DivinationType.RUNES && 'IV'}
                            </div>
                            <div className="text-left border-l-2 border-white/10 pl-6">
                                <h3 className="font-cinzel text-xl font-bold text-amber-100 group-hover:text-amber-400">{mode.name}</h3>
                                <p className="text-xs text-slate-400 font-sans mt-1">{mode.description}</p>
                            </div>
                         </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Interaction Mode */}
                {selectedMode && (
                  <div className="flex flex-col h-full animate-[slideUp_0.5s_ease-out]">
                    <button 
                        onClick={handleBack}
                        className="self-start text-[10px] font-pixel text-slate-500 hover:text-amber-500 mb-6 flex items-center gap-2 uppercase tracking-widest"
                    >
                        <ArrowLeft size={10} /> Return to Menu
                    </button>

                    {!hasStarted ? (
                        <div className="space-y-6 flex-grow flex flex-col justify-center">
                             <div className="text-center">
                                <PixelMoon size={48} className="mx-auto mb-4 animate-pulse text-purple-400" />
                                <h2 className="font-cinzel text-2xl text-amber-500 mb-2">
                                    {MODES.find(m => m.id === selectedMode)?.name}
                                </h2>
                                <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-500 to-transparent mx-auto"></div>
                             </div>

                             {selectedMode === DivinationType.ASTROLOGY && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-pixel text-slate-400">DATE OF BIRTH</label>
                                    <input 
                                        type="date" 
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="w-full bg-black border border-slate-600 p-3 text-sm text-center font-mono text-amber-500 focus:border-amber-500 focus:outline-none focus:shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all"
                                    />
                                </div>
                             )}

                             <div className="space-y-2">
                                <label className="text-[10px] font-pixel text-slate-400">ENTER YOUR INTENTION</label>
                                <textarea
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="在此专注于你的问题..."
                                    className="w-full h-32 bg-black border border-slate-600 p-4 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all resize-none font-serif text-lg leading-relaxed text-center"
                                />
                             </div>

                             <button
                                onClick={startDivination}
                                disabled={!userInput.trim() && selectedMode !== DivinationType.ASTROLOGY}
                                className="w-full py-4 bg-amber-900/30 border-2 border-amber-600 text-amber-500 font-bold hover:bg-amber-600 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                             >
                                <Sparkles className="group-hover:animate-spin" size={18} />
                                <span className="font-pixel text-xs tracking-[0.2em]">REVEAL FATE</span>
                             </button>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full min-h-[400px]">
                             {isLoading && !result && (
                                <div className="flex-grow flex flex-col items-center justify-center">
                                    <LoadingOrb />
                                </div>
                             )}

                             {(result || !isLoading) && (
                                <div className="flex flex-col h-full">
                                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar border-t border-b border-slate-800 py-4 bg-black/20" ref={resultContainerRef}>
                                        <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-amber-500 prose-strong:text-purple-300 max-w-none text-justify">
                                            <ReactMarkdown 
                                                components={{
                                                    strong: ({node, ...props}) => <strong className="text-amber-400 font-bold font-cinzel text-lg block mt-4 mb-2 border-l-2 border-amber-600 pl-3" {...props} />,
                                                    p: ({node, ...props}) => <p className="mb-4 leading-8 text-slate-300" {...props} />,
                                                    li: ({node, ...props}) => <li className="list-none mb-2 pl-4 border-l border-slate-700 text-slate-400" {...props} />
                                                }}
                                            >
                                                {result}
                                            </ReactMarkdown>
                                            {isLoading && <span className="inline-block w-2 h-5 bg-amber-500 animate-pulse align-middle ml-1"></span>}
                                        </div>
                                    </div>
                                    
                                    {!isLoading && (
                                        <div className="mt-6 text-center">
                                            <button 
                                                onClick={() => { setHasStarted(false); setUserInput(''); setBirthDate(''); }}
                                                className="px-8 py-2 border border-slate-600 text-slate-400 text-[10px] font-pixel hover:bg-slate-800 hover:text-white transition-colors uppercase tracking-widest"
                                            >
                                                Start New Session
                                            </button>
                                        </div>
                                    )}
                                </div>
                             )}
                        </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6 opacity-30">
            <PixelSkull size={24} className="mx-auto mb-2" />
            <p className="font-pixel text-[8px] text-slate-500 tracking-widest">EST. 2025 • MYSTIC ORACLE WEB</p>
        </div>
      </div>
    </div>
  );
};

export default App;