import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="bg-indigo-50 p-3 rounded-full mb-6 animate-fade-in-up">
        <Sparkles className="w-8 h-8 text-indigo-600" />
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
        Don't just find a job. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
          Create it.
        </span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
        The traditional job market is rigid. Your potential isn't. 
        Use AI to deconstruct your skills and passions into a bespoke career path 
        that fits you perfectly.
      </p>
      <button
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
      >
        Start Designing Your Future
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
      
      <div className="mt-16 flex gap-8 text-sm text-slate-400 font-medium uppercase tracking-widest">
        <span>Identify</span>
        <span className="text-indigo-300">•</span>
        <span>Innovate</span>
        <span className="text-indigo-300">•</span>
        <span>Execute</span>
      </div>
    </div>
  );
};