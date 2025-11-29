import React, { useState, useRef, useEffect } from 'react';
import ParticleBackground from './components/ParticleBackground';
import LoadingOrb from './components/LoadingOrb';
import { PixelMoon, PixelPotion, PixelCrystalBall, PixelSkull } from './components/PixelSymbols';
import { streamDivination } from './services/geminiService';
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
    color: "bg-purple-900"
  },
  {
    id: DivinationType.ICHING,
    name: "周易神算 (I Ching)",
    description: "源自东方的古老智慧，解析阴阳变幻。",
    icon: "yin-yang",
    color: "bg-slate-800"
  },
  {
    id: DivinationType.ASTROLOGY,
    name: "星盘解读 (Astrology)",
    description: "聆听星辰的低语，洞察宇宙能量。",
    icon: "star",
    color: "bg-blue-900"
  },
  {
    id: DivinationType.RUNES,
    name: "卢恩符文 (Runes)",
    description: "北欧奥丁的神谕，直击命运核心。",
    icon: "stone",
    color: "bg-emerald-900"
  }
];

const Website: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<DivinationType | null>(null);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Specific state for form inputs
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

    let prompt = userInput;
    if (selectedMode === DivinationType.ASTROLOGY && birthDate) {
      prompt = `我的出生日期是 ${birthDate}。我的问题是：${userInput}`;
    }

    try {
      const stream = streamDivination(selectedMode!, prompt);
      
      for await (const chunk of stream) {
        setResult(prev => prev + chunk);
      }
    } catch (e) {
      console.error(e);
      setResult("冥冥之中的迷雾遮挡了视线...");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto scroll to bottom of result
  useEffect(() => {
    if (resultContainerRef.current) {
      resultContainerRef.current.scrollTop = resultContainerRef.current.scrollHeight;
    }
  }, [result]);

  return (
    <div className="min-h-screen text-slate-200 relative overflow-hidden flex flex-col items-center">
      <ParticleBackground />

      {/* Decorative Pixel Stickers */}
      <div className="fixed top-10 left-[5%] animate-float opacity-80 hidden lg:block pointer-events-none z-0">
        <PixelPotion size={120} />
      </div>
      <div className="fixed bottom-20 right-[5%] animate-float opacity-60 hidden lg:block pointer-events-none z-0" style={{ animationDelay: '1s' }}>
        <PixelCrystalBall size={140} />
      </div>
      <div className="fixed top-20 right-[10%] opacity-40 hidden lg:block pointer-events-none z-0">
        <PixelMoon size={80} color="#fbbf24" />
      </div>
      <div className="fixed bottom-10 left-[10%] opacity-30 hidden lg:block pointer-events-none z-0" style={{ animationDelay: '2s' }}>
        <PixelSkull size={100} />
      </div>

      {/* Website Navigation/Header */}
      <nav className="w-full border-b-4 border-slate-800 bg-slate-900/80 px-8 py-4 flex justify-between items-center z-20 sticky top-0 backdrop-blur-sm">
         <div className="font-pixel text-amber-500 text-lg flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-500 inline-block animate-pulse"></span>
            MYSTIC-ORACLE.NET
         </div>
         <div className="hidden md:flex space-x-6 text-xs font-pixel text-slate-400">
            <span className="hover:text-white cursor-pointer">HOME</span>
            <span className="hover:text-white cursor-pointer">ABOUT</span>
            <span className="hover:text-white cursor-pointer">CONTACT</span>
         </div>
      </nav>

      {/* Hero Header */}
      <header className="w-full p-8 flex flex-col items-center justify-center z-10 relative mt-4">
        <div className="border-4 border-amber-500 bg-black/80 p-6 shadow-[8px_8px_0_0_#b45309] transform hover:-translate-y-1 transition-transform cursor-pointer" onClick={handleBack}>
           <h1 className="text-3xl md:text-5xl font-pixel font-bold text-amber-400 tracking-wider pixel-text-shadow">
            MYSTIC-ORACLE.NET
          </h1>
          <p className="text-center text-amber-200 mt-2 font-serif text-sm md:text-base border-t-2 border-amber-900/50 pt-2 tracking-[0.2em]">
            全球神秘文化在线占卜网
          </p>
        </div>
      </header>

      <main className="w-full max-w-4xl px-4 pb-12 z-10 flex-grow flex flex-col justify-center">
        
        {/* Mode Selection Grid */}
        {!selectedMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-[fadeIn_1s_ease-out] mt-4">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleModeSelect(mode.id)}
                className={`group relative pixel-box p-6 transition-all duration-200 hover:bg-slate-800 bg-opacity-90 bg-slate-900`}
              >
                 {/* Inner border for double-border effect */}
                 <div className="absolute inset-1 border-2 border-white/5 pointer-events-none" />
                 
                <div className="relative z-10 flex items-start space-x-4">
                  <div className={`p-4 ${mode.color} border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]`}>
                    <div className="text-white">
                        {mode.id === DivinationType.TAROT && <div className="font-pixel text-2xl">I</div>}
                        {mode.id === DivinationType.ICHING && <div className="font-pixel text-2xl">II</div>}
                        {mode.id === DivinationType.ASTROLOGY && <div className="font-pixel text-2xl">III</div>}
                        {mode.id === DivinationType.RUNES && <div className="font-pixel text-2xl">IV</div>}
                    </div>
                  </div>
                  <div className="text-left pt-1">
                    <h2 className="text-xl font-bold text-amber-300 group-hover:text-amber-200 transition-colors font-cinzel pixel-text-shadow">{mode.name}</h2>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed font-sans">{mode.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Divination Interface */}
        {selectedMode && (
          <div className="w-full max-w-2xl mx-auto animate-[slideUp_0.5s_ease-out]">
            
            {/* Retro Card Container */}
            <div className="bg-[#1a1b26] border-4 border-slate-500 shadow-[8px_8px_0_0_#0f172a] p-1">
              <div className="border-2 border-slate-700 p-6 md:p-8 bg-[#13141f]">
              
                {/* Header with Back Button */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b-4 border-slate-800 border-dashed">
                  <button 
                    onClick={handleBack}
                    className="flex items-center text-slate-400 hover:text-amber-400 transition-colors group"
                  >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-pixel text-xs">WEB_HOME</span>
                  </button>
                  <h2 className="text-xl md:text-2xl font-bold text-amber-400 font-cinzel pixel-text-shadow tracking-widest">
                    {MODES.find(m => m.id === selectedMode)?.name.split('(')[0]}
                  </h2>
                </div>

                {/* Input Section */}
                {!hasStarted ? (
                  <div className="space-y-6">
                    <div className="text-center mb-6 bg-slate-900/50 p-4 border-2 border-slate-800">
                        <p className="text-lg text-purple-300 font-serif italic">
                          "Connecting to Mystic Server..."
                        </p>
                    </div>

                    {selectedMode === DivinationType.ASTROLOGY && (
                      <div className="flex flex-col space-y-2">
                        <label className="text-xs text-slate-400 font-pixel uppercase">Birth Date</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full bg-black border-2 border-slate-600 p-3 text-slate-200 focus:outline-none focus:border-amber-500 focus:shadow-[4px_4px_0_0_#b45309] transition-all font-mono"
                        />
                      </div>
                    )}

                    <div className="relative">
                      <label className="text-xs text-slate-400 font-pixel uppercase mb-2 block">Your Query</label>
                      <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="在此输入你的疑惑..."
                        className="w-full h-32 bg-black border-2 border-slate-600 p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:shadow-[4px_4px_0_0_#7e22ce] transition-all resize-none font-serif text-lg"
                      />
                    </div>

                    <button
                        onClick={startDivination}
                        disabled={!userInput.trim() && selectedMode !== DivinationType.ASTROLOGY}
                        className="w-full py-4 bg-purple-700 hover:bg-purple-600 text-white font-bold border-4 border-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3 mt-4"
                    >
                        <Sparkles size={20} />
                        <span className="font-pixel tracking-widest">SUBMIT QUERY</span>
                    </button>
                  </div>
                ) : (
                  /* Result Section */
                  <div className="flex flex-col h-[60vh]">
                    
                    {isLoading && !result && (
                      <div className="flex-grow flex items-center justify-center">
                        <LoadingOrb />
                      </div>
                    )}

                    {(result || (!isLoading && hasStarted)) && (
                      <div className="flex flex-col h-full">
                        <div 
                            ref={resultContainerRef}
                            className="flex-grow overflow-y-auto pr-4 space-y-4 text-slate-300 leading-loose font-serif custom-scrollbar"
                        >
                          <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-amber-400 prose-strong:text-purple-300 max-w-none border-l-4 border-slate-800 pl-4">
                              <ReactMarkdown 
                                components={{
                                  strong: ({node, ...props}) => <span className="text-amber-300 font-bold bg-amber-900/30 px-1" {...props} />,
                                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold border-b-2 border-slate-700 pb-2 mb-4 font-cinzel" {...props} />,
                                  h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3 text-purple-300 font-cinzel" {...props} />,
                                  li: ({node, ...props}) => <li className="marker:text-amber-500" {...props} />
                                }}
                              >
                                {result}
                              </ReactMarkdown>
                          </div>
                          {isLoading && <span className="inline-block w-3 h-6 bg-amber-500 animate-pulse ml-2 align-middle border border-black"></span>}
                        </div>
                        
                        {!isLoading && (
                          <div className="mt-6 pt-6 border-t-2 border-slate-800 border-dashed flex justify-center">
                              <button
                                onClick={() => {
                                    setHasStarted(false);
                                    setUserInput('');
                                    setBirthDate('');
                                }}
                                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-pixel uppercase tracking-widest border-2 border-slate-500 shadow-[3px_3px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
                              >
                                NEW QUERY
                              </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full p-6 text-center text-slate-500 text-[10px] font-pixel z-10 opacity-70">
        <span className="border-b border-slate-700 pb-1">MYSTIC-ORACLE.NET © 2025 | ALL RIGHTS RESERVED</span>
      </footer>
    </div>
  );
};

export default Website;