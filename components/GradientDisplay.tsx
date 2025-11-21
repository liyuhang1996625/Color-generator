import React, { useMemo, useState } from 'react';
import { GradientConfig } from '../types';
import { Copy, Code, Check, Eye } from 'lucide-react';

interface GradientDisplayProps {
  config: GradientConfig;
}

export const GradientDisplay: React.FC<GradientDisplayProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'css' | 'svg'>('preview');
  const [copied, setCopied] = useState(false);

  const sortedStops = useMemo(() => {
    return [...config.stops].sort((a, b) => a.offset - b.offset);
  }, [config.stops]);

  // CSS Generator
  const cssGradient = useMemo(() => {
    const stopsStr = sortedStops.map(s => `${s.color} ${s.offset}%`).join(', ');
    if (config.type === 'radial') {
      return `radial-gradient(circle, ${stopsStr})`;
    }
    return `linear-gradient(${config.angle}deg, ${stopsStr})`;
  }, [config, sortedStops]);

  // SVG Generator
  const svgCode = useMemo(() => {
    const stopsXml = sortedStops.map(s => 
      `<stop offset="${s.offset}%" stop-color="${s.color}" />`
    ).join('\n    ');

    let animationXml = '';
    if (config.animation === 'rotate') {
      animationXml = `
      <animateTransform 
        attributeName="gradientTransform" 
        type="rotate" 
        from="0 .5 .5" 
        to="360 .5 .5" 
        dur="${config.animationDuration}s" 
        repeatCount="indefinite" 
      />`;
    } else if (config.animation === 'pulse') {
       animationXml = `
       <animate 
         attributeName="r" 
         values="0.5; 0.8; 0.5" 
         dur="${config.animationDuration}s" 
         repeatCount="indefinite" 
       />`;
    }

    const gradientId = "grad1";
    
    if (config.type === 'radial') {
        return `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      ${stopsXml}
      ${config.animation === 'pulse' ? animationXml : ''}
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="100" height="100" fill="url(#${gradientId})" />
</svg>`;
    }

    // Linear
    return `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="50%" x2="100%" y2="50%">
      ${stopsXml}
      ${config.animation === 'rotate' ? animationXml : ''}
      ${config.animation !== 'rotate' && config.type === 'linear' ? 
        `<animateTransform attributeName="gradientTransform" type="rotate" from="${config.angle} .5 .5" to="${config.angle} .5 .5" dur="1s" fill="freeze" />` 
        : ''}
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="100" height="100" fill="url(#${gradientId})" />
</svg>`;
  }, [config, sortedStops]);

  const handleCopy = () => {
    const text = activeTab === 'svg' ? svgCode : cssGradient;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-black rounded-none overflow-hidden border border-white/40 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition-all">
      {/* Header / Tabs */}
      <div className="flex items-center justify-between px-2 py-2 bg-black border-b border-white/20">
        <div className="flex space-x-0">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all ${
              activeTab === 'preview' ? 'bg-white text-black border-white' : 'bg-black text-white/60 border-transparent hover:border-white/40'
            }`}
          >
            <div className="flex items-center gap-2"><Eye size={14}/> Preview</div>
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all ${
              activeTab === 'css' ? 'bg-white text-black border-white' : 'bg-black text-white/60 border-transparent hover:border-white/40'
            }`}
          >
            <div className="flex items-center gap-2"><Code size={14}/> CSS</div>
          </button>
          <button
            onClick={() => setActiveTab('svg')}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all ${
              activeTab === 'svg' ? 'bg-white text-black border-white' : 'bg-black text-white/60 border-transparent hover:border-white/40'
            }`}
          >
            <div className="flex items-center gap-2"><Code size={14}/> SVG</div>
          </button>
        </div>

        {(activeTab === 'css' || activeTab === 'svg') && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 bg-white text-black text-xs font-bold uppercase hover:bg-white/80 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "COPIED" : "COPY"}
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 relative w-full h-full bg-black flex items-center justify-center p-4">
        
        {activeTab === 'preview' && (
          <div className="w-full h-full shadow-sm overflow-hidden relative border border-white/20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            {/* We use an SVG for preview to accurately reflect the SVG Animation settings */}
            <div 
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: svgCode }} 
            />
          </div>
        )}

        {activeTab === 'css' && (
          <div className="w-full h-full p-4 font-mono text-sm text-white overflow-auto bg-black border border-white/20 custom-scrollbar">
             <pre className="whitespace-pre-wrap break-all">
{`background: ${cssGradient};`}
             </pre>
          </div>
        )}

        {activeTab === 'svg' && (
          <div className="w-full h-full p-4 font-mono text-xs text-white overflow-auto bg-black border border-white/20 custom-scrollbar">
             <pre className="whitespace-pre-wrap break-all">
{svgCode}
             </pre>
          </div>
        )}
      </div>
    </div>
  );
};