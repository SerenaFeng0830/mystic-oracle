import React, { useState, useRef, useEffect } from 'react';
import ParticleBackground from './components/ParticleBackground';
import LoadingOrb from './components/LoadingOrb';
import { PixelMoon, PixelPotion, PixelCrystalBall, PixelSkull } from './components/PixelSymbols';
import { streamDivination } from './services/geminiService';
import { DivinationType, DivinationConfig } from './types';
import { Sparkles, ArrowRight, Globe, Monitor } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Constants for UI
const MODES: DivinationConfig[] = [
  {
    id: DivinationType.TAROT,
    name: "塔罗秘境",
    description: "揭示过去、现在与未来的潜意识指引。",
    icon: "cards",
    color: "bg-purple-900"
  },
  {
    id: DivinationType.ICHING,
    name: "周易神算",
    description: "源自东方的古老智慧，解析阴阳变幻。",
    icon: "yin-yang",
    color: "bg-slate-800"
  },
  {
    id: DivinationType.ASTROLOGY,
    name: "星盘解读",
    description: "聆听星辰的低语，洞察宇宙能量。",
    icon: "star",
    color: "bg-blue-900"
  },
  {
    id: DivinationType.RUNES,
    name: "卢恩符文",
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
    setBirthDate('');
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
    <div className="min-h-screen text-slate-200 relative flex flex-col font-serif">
      <ParticleBackground />

      {/* Website Top Navigation Bar */}
      <nav className="w-full h-16 bg-slate-900/90 border-b-4 border-slate-700 flex items-center justify-between px-6 md:px-12 z-50 shadow-[0_4px_0_0_rgba(0,0,0,0.3)]">
         <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-amber-500 border-2 border-white flex items-center justify-center font-bold text-black font-pixel text-xl">M</div>
             <div className="font-pixel text-amber-500 text-xl tracking-wider hidden md:block">
                MYSTIC-ORACLE.NET
             </div>
         </div>
         <div className="flex space-x-8 text-xs font-pixel text-slate-400">
            <a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-2"><Globe size={14}/> GLOBAL_NODES</a>
            <a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-2"><Monitor size={14}/> SYSTEM_STATUS</a>
         </div>
      </nav>

      <div className="flex-grow flex flex-col md:flex-row max-w-[1600px] w-full mx-auto p-4 md:p-8 gap-8 z-10">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-80 flex flex-col gap-4 animate-[fadeIn_0.5s_ease-out]">
            <div className="bg-slate-900/80 border-4 border-slate-600 p-4 shadow-[4px_4px_0_0_#000]">
                <h3 className="font-pixel text-slate-400 text-xs mb-4 border-b-2 border-slate-700 pb-2">SELECT MODULE</h3>
                <div className="flex flex-col gap-3">
                    {MODES.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => handleModeSelect(mode.id)}
                            className={`
                                w-full p-3 text-left border-2 transition-all flex items-center gap-3 font-cinzel text-sm font-bold
                                ${selectedMode === mode.id 
                                    ? 'bg-amber-900/50 border-amber-500 text-amber-200 shadow-[2px_2px_0_0_#b45309] translate-x-1' 
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200 hover:border-slate-500'}
                            `}
                        >
                            <span className={`w-2 h-2 ${selectedMode === mode.id ? 'bg-amber-400' : 'bg-slate-600'}`}></span>
                            {mode.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Decorative Sidebar Element */}
            <div className="hidden md:flex flex-col items-center justify-center p-6 bg-black/40 border-2 border-dashed border-slate-700 flex-grow min-h-[200px]">
                <PixelCrystalBall size={100} />
                <p className="font-pixel text-[10px] text-slate-500 mt-4 text-center">
                    SERVER_TIME: <br/> {new Date().toLocaleTimeString()}
                </p>
            </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow relative min-h-[600px]">
            {/* Background Container Box */}
            <div className="absolute inset-0 bg-slate-900/60 border-4 border-slate-600 shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] z-0"></div>
            
            <div className="relative z-10 h-full p-6 md:p-10 flex flex-col">
                
                {!selectedMode ? (
                    // Welcome Screen (Empty State)
                    <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6 animate-[fadeIn_1s]">
                        <PixelPotion size={120} />
                        <h1 className="text-4xl md:text-6xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-400 py-2">
                            WELCOME USER
                        </h1>
                        <p className="max-w-xl text-slate-400 font-serif text-lg leading-relaxed">
                            欢迎来到 MysticOracle.net。这是一个连接古代神秘学与现代人工智能的数字枢纽。<br/>
                            请在左侧侧边栏选择一种占卜模块以开始您的命运探索之旅。
                        </p>
                        <div className="grid grid-cols-4 gap-4 mt-8 opacity-50">
                            <PixelMoon size={32} />
                            <PixelSkull size={32} />
                            <PixelMoon size={32} />
                            <PixelSkull size={32} />
                        </div>
                    </div>
                ) : (
                    // Divination Interface
                    <div className="flex flex-col h-full animate-[fadeIn_0.5s]">
                         {/* Header */}
                        <header className="flex items-center justify-between border-b-2 border-slate-700 pb-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${MODES.find(m => m.id === selectedMode)?.color} border-2 border-white flex items-center justify-center`}>
                                   {/* Simple Icon representation */}
                                   <Sparkles className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-cinzel font-bold text-amber-400">
                                        {MODES.find(m => m.id === selectedMode)?.name}
                                    </h2>
                                    <p className="text-xs font-pixel text-slate-500 uppercase tracking-widest">
                                        {MODES.find(m => m.id === selectedMode)?.description}
                                    </p>
                                </div>
                            </div>
                        </header>

                        {/* Interaction Area */}
                        <div className="flex-grow flex flex-col md:flex-row gap-6">
                            
                            {/* Input Column */}
                            <div className={`w-full md:w-1/3 flex flex-col gap-4 transition-all duration-500 ${hasStarted ? 'md:w-1/4 opacity-60' : ''}`}>
                                 {selectedMode === DivinationType.ASTROLOGY && (
                                    <div className="flex flex-col space-y-1">
                                        <label className="text-[10px] text-slate-400 font-pixel uppercase">Target Date</label>
                                        <input
                                            type="date"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            className="w-full bg-black border-2 border-slate-600 p-2 text-slate-200 focus:outline-none focus:border-amber-500 transition-all font-mono text-sm"
                                        />
                                    </div>
                                )}
                                
                                <div className="flex-grow flex flex-col">
                                    <label className="text-[10px] text-slate-400 font-pixel uppercase mb-1">Query Input</label>
                                    <textarea
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        placeholder="在此输入您的问题..."
                                        disabled={hasStarted}
                                        className="w-full flex-grow min-h-[200px] bg-black border-2 border-slate-600 p-3 text-slate-200 focus:outline-none focus:border-purple-500 transition-all resize-none font-serif disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>

                                <button
                                    onClick={startDivination}
                                    disabled={(!userInput.trim() && selectedMode !== DivinationType.ASTROLOGY) || (hasStarted && isLoading)}
                                    className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold border-2 border-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <LoadingOrb /> : (
                                        <>
                                            <span className="font-pixel text-xs tracking-widest">INITIATE</span>
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                                
                                {hasStarted && !isLoading && (
                                     <button
                                        onClick={() => {
                                            setHasStarted(false);
                                            setUserInput('');
                                            setBirthDate('');
                                        }}
                                        className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold border-2 border-black text-xs font-pixel"
                                    >
                                        RESET
                                    </button>
                                )}
                            </div>

                            {/* Output Column */}
                            <div className="w-full md:w-2/3 bg-black/40 border-2 border-slate-700 p-4 relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 left-0 bg-slate-800 text-[10px] font-pixel px-2 py-1 text-slate-400 border-b border-r border-slate-700">
                                    OUTPUT_TERMINAL
                                </div>
                                
                                {!hasStarted && (
                                    <div className="flex-grow flex items-center justify-center opacity-30">
                                        <PixelMoon size={64} />
                                    </div>
                                )}

                                {hasStarted && (
                                    <div 
                                        ref={resultContainerRef}
                                        className="mt-6 flex-grow overflow-y-auto pr-2 custom-scrollbar"
                                    >
                                         <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-amber-400 prose-strong:text-purple-300 max-w-none">
                                            <ReactMarkdown 
                                                components={{
                                                strong: ({node, ...props}) => <span className="text-amber-300 font-bold bg-amber-900/30 px-1" {...props} />,
                                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold border-b border-dashed border-slate-700 pb-2 mb-4 font-cinzel text-amber-500" {...props} />,
                                                h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-6 mb-3 text-purple-400 font-cinzel" {...props} />,
                                                li: ({node, ...props}) => <li className="marker:text-amber-500" {...props} />
                                                }}
                                            >
                                                {result}
                                            </ReactMarkdown>
                                            {isLoading && <span className="inline-block w-2 h-4 bg-amber-500 animate-pulse ml-1 align-middle"></span>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
      </div>

      {/* Website Footer */}
      <footer className="w-full bg-slate-900 border-t-4 border-slate-700 py-8 mt-8">
         <div className="max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="text-left">
                 <h4 className="font-pixel text-slate-300 mb-2">MYSTIC-ORACLE.NET</h4>
                 <p className="text-slate-500 text-xs font-serif max-w-md">
                     本网站提供的所有占卜结果均由人工智能生成，仅供娱乐与心理咨询参考。请勿将结果作为重大人生决策的唯一依据。
                 </p>
             </div>
             <div className="flex gap-4 font-pixel text-[10px] text-slate-400">
                 <a href="#" className="hover:text-white underline">PRIVACY_POLICY</a>
                 <a href="#" className="hover:text-white underline">TERMS_OF_SERVICE</a>
                 <a href="#" className="hover:text-white underline">API_STATUS</a>
             </div>
         </div>
      </footer>
    </div>
  );
};

export default Website;