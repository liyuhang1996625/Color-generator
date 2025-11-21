import React, { useState } from 'react';
import { GradientConfig, ColorStop, AnimationType, GradientType } from '../types';
import { Plus, Trash2, Sparkles, RefreshCw, Zap } from 'lucide-react';

interface ControlPanelProps {
  config: GradientConfig;
  onChange: (newConfig: GradientConfig) => void;
  onAIGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ config, onChange, onAIGenerate, isGenerating }) => {
  const [aiPrompt, setAiPrompt] = useState('');

  const handleStopChange = (id: string, field: keyof ColorStop, value: string | number) => {
    const newStops = config.stops.map(stop => {
      if (stop.id === id) {
        return { ...stop, [field]: value };
      }
      return stop;
    });
    onChange({ ...config, stops: newStops });
  };

  const addStop = () => {
    const newStop: ColorStop = {
      id: crypto.randomUUID(),
      color: '#ffffff',
      offset: 50
    };
    onChange({ ...config, stops: [...config.stops, newStop] });
  };

  const removeStop = (id: string) => {
    if (config.stops.length <= 2) return; // Min 2 stops
    onChange({ ...config, stops: config.stops.filter(s => s.id !== id) });
  };

  const handleTypeChange = (type: GradientType) => {
    onChange({ ...config, type });
  };

  const handleAnimationChange = (animation: AnimationType) => {
    onChange({ ...config, animation });
  };

  return (
    <div className="w-full lg:w-96 bg-black border-t-0 lg:border-l border-white/20 h-full flex flex-col overflow-hidden font-mono">
      
      {/* AI Section */}
      <div className="p-5 border-b border-white/20 bg-black">
        <div className="flex items-center gap-2 mb-3 text-white font-bold uppercase tracking-wider text-xs">
          <Sparkles size={14} />
          <h3>AI Generation</h3>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Describe mood..."
            className="flex-1 bg-black border border-white/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white focus:ring-0 transition-all rounded-none"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAIGenerate(aiPrompt)}
          />
          <button
            onClick={() => onAIGenerate(aiPrompt)}
            disabled={isGenerating || !aiPrompt.trim()}
            className="bg-white hover:bg-white/80 disabled:bg-white/20 disabled:text-black/50 text-black border border-white/30 p-2 transition-all rounded-none"
          >
            {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
        
        {/* Basic Settings */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-white/60 uppercase tracking-wider block border-b border-white/20 pb-1">Type</label>
          
          <div className="grid grid-cols-2 gap-0 border border-white/30">
             <button
                onClick={() => handleTypeChange('linear')}
                className={`px-4 py-2 text-xs font-bold uppercase transition-all ${
                  config.type === 'linear' 
                    ? 'bg-white text-black' 
                    : 'bg-black text-white/50 hover:text-white border-r border-white/30'
                }`}
             >
               Linear
             </button>
             <button
                onClick={() => handleTypeChange('radial')}
                className={`px-4 py-2 text-xs font-bold uppercase transition-all ${
                  config.type === 'radial' 
                    ? 'bg-white text-black' 
                    : 'bg-black text-white/50 hover:text-white'
                }`}
             >
               Radial
             </button>
          </div>

          {config.type === 'linear' && (
             <div className="space-y-2">
               <div className="flex justify-between text-xs text-white/50 font-mono">
                 <span>ANGLE</span>
                 <span>{config.angle}°</span>
               </div>
               <input
                 type="range"
                 min="0"
                 max="360"
                 value={config.angle}
                 onChange={(e) => onChange({ ...config, angle: Number(e.target.value) })}
                 className="w-full h-1 bg-white/20 appearance-none cursor-pointer hover:bg-white/40"
               />
             </div>
          )}
        </div>

        {/* Animation Settings */}
        <div className="space-y-4">
           <label className="text-xs font-bold text-white/60 uppercase tracking-wider block border-b border-white/20 pb-1 flex items-center gap-2">
             Animation
           </label>
           
           <div className="grid grid-cols-3 gap-2">
              {(['none', 'rotate', 'pulse'] as AnimationType[]).map((anim) => (
                <button
                  key={anim}
                  onClick={() => handleAnimationChange(anim)}
                  className={`px-2 py-2 text-[10px] font-bold border transition-all uppercase tracking-wide ${
                    config.animation === anim
                      ? 'bg-white border-white text-black'
                      : 'bg-black border-white/20 text-white/40 hover:border-white/60 hover:text-white'
                  }`}
                >
                  {anim}
                </button>
              ))}
           </div>

           {config.animation !== 'none' && (
             <div className="space-y-2">
               <div className="flex justify-between text-xs text-white/50 font-mono">
                 <span>DURATION</span>
                 <span>{config.animationDuration}s</span>
               </div>
               <input
                 type="range"
                 min="1"
                 max="20"
                 step="0.5"
                 value={config.animationDuration}
                 onChange={(e) => onChange({ ...config, animationDuration: Number(e.target.value) })}
                 className="w-full h-1 bg-white/20 appearance-none cursor-pointer hover:bg-white/40"
               />
             </div>
           )}
        </div>

        {/* Color Stops */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/20 pb-1">
            <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Stops</label>
            <button 
              onClick={addStop}
              className="p-1 bg-white text-black hover:bg-white/80 transition-colors border border-white/30"
              title="Add Color"
            >
              <Plus size={12} />
            </button>
          </div>
          
          <div className="space-y-3">
            {config.stops.map((stop) => (
              <div key={stop.id} className="flex items-center gap-3 bg-black p-2 border border-white/20 transition-colors group">
                <div className="relative w-8 h-8 border border-white/30 flex-shrink-0 cursor-pointer">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => handleStopChange(stop.id, 'color', e.target.value)}
                    className="absolute top-0 left-0 w-full h-full p-0 cursor-pointer border-none opacity-0 z-10"
                  />
                  <div className="w-full h-full" style={{backgroundColor: stop.color}}></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] text-white/50 mb-1 font-mono uppercase">
                    <span>Pos</span>
                    <span>{stop.offset}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stop.offset}
                    onChange={(e) => handleStopChange(stop.id, 'offset', Number(e.target.value))}
                    className="w-full h-1 bg-white/20 appearance-none cursor-pointer hover:bg-white/40"
                  />
                </div>

                <button
                  onClick={() => removeStop(stop.id)}
                  disabled={config.stops.length <= 2}
                  className="p-1.5 text-white/30 hover:text-white disabled:opacity-20 disabled:hover:text-white/30 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};