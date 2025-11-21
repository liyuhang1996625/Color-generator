import React, { useState } from 'react';
import { GradientDisplay } from './components/GradientDisplay';
import { ControlPanel } from './components/ControlPanel';
import { GradientConfig } from './types';
import { Palette } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<GradientConfig>({
    type: 'linear',
    angle: 135,
    animation: 'none',
    animationDuration: 10,
    stops: [
      { id: '1', color: '#ffffff', offset: 0 },
      { id: '2', color: '#000000', offset: 100 }
    ]
  });

  return (
    <div className="flex flex-col h-full bg-black text-white font-sans selection:bg-white selection:text-black">
      
      {/* Header */}
      <header className="h-16 border-b border-white/20 bg-black flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-white/30 bg-black flex items-center justify-center">
            <Palette size={18} className="text-white" />
          </div>
          <h1 className="font-bold text-xl tracking-tighter text-white uppercase">
            Chromaflow <span className="text-[10px] font-bold text-white/80 border border-white/30 ml-2 px-2 py-0.5 align-middle">BETA</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-xs font-mono text-white/60 hidden sm:block border border-white/20 px-3 py-1">
            SVG ANIMATED GRADIENTS
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left Panel - Preview */}
        <div className="flex-1 p-4 lg:p-8 flex flex-col gap-4 min-h-[400px] bg-black border-b lg:border-b-0 border-white/20">
          <GradientDisplay config={config} />
          
          <div className="hidden lg:block text-center text-white/30 font-mono text-[10px] mt-2 uppercase tracking-widest">
            Preview Mode
          </div>
        </div>

        {/* Right Panel - Controls */}
        <ControlPanel 
          config={config} 
          onChange={setConfig} 
        />

      </main>
    </div>
  );
};

export default App;