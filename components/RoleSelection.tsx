import React from 'react';
import { GeneratedRole } from '../types';
import { Target, Zap, Rocket, Feather, TrendingUp, ArrowRight, Check, GitMerge } from 'lucide-react';

interface RoleSelectionProps {
  roles: GeneratedRole[];
  selectedRoles: GeneratedRole[];
  onToggleRole: (role: GeneratedRole) => void;
  onConfirm: () => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ roles, selectedRoles, onToggleRole, onConfirm }) => {
  const getIcon = (index: number) => {
    switch(index) {
      case 0: return <Target className="w-6 h-6 text-emerald-500" />;
      case 1: return <Rocket className="w-6 h-6 text-orange-500" />;
      case 2: return <Feather className="w-6 h-6 text-blue-500" />;
      case 3: return <Zap className="w-6 h-6 text-purple-500" />;
      default: return <Target className="w-6 h-6 text-slate-500" />;
    }
  };

  const getBadge = (index: number) => {
    switch(index) {
      case 0: return "Safe Bet";
      case 1: return "The Reach";
      case 2: return "The Pivot";
      case 3: return "Wildcard";
      default: return "Option";
    }
  };

  const isSelected = (role: GeneratedRole) => selectedRoles.some(r => r.id === role.id);
  const selectionCount = selectedRoles.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 mb-4">
          Your Future, Architected
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Select <span className="font-bold text-indigo-600">one path</span> to explore, or <span className="font-bold text-indigo-600">select two</span> to create a hybrid role.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role, idx) => {
          const selected = isSelected(role);
          return (
            <div 
              key={role.id || idx}
              onClick={() => onToggleRole(role)}
              className={`group relative rounded-2xl p-6 border-2 shadow-sm transition-all duration-300 cursor-pointer overflow-hidden
                ${selected 
                  ? 'bg-indigo-50 border-indigo-600 shadow-lg transform -translate-y-1' 
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1'}`}
            >
              <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-xl text-xs font-bold uppercase tracking-wider
                ${selected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {selected ? <Check size={14} className="inline mr-1" /> : null}
                {getBadge(idx)}
              </div>

              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl transition-colors ${selected ? 'bg-white' : 'bg-slate-50 group-hover:bg-indigo-50'}`}>
                  {getIcon(idx)}
                </div>
              </div>

              <h3 className={`text-2xl font-bold mb-2 transition-colors ${selected ? 'text-indigo-700' : 'text-slate-900'}`}>
                {role.title}
              </h3>
              <p className="text-sm font-medium text-indigo-500 mb-4 font-mono">
                {role.tagline}
              </p>
              
              <p className="text-slate-600 mb-6 line-clamp-3">
                {role.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white/50 p-3 rounded-lg border border-slate-100">
                  <TrendingUp size={16} />
                  <span className="font-medium">Demand Score:</span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${role.demandScore * 10}%` }}
                    />
                  </div>
                  <span className="font-bold">{role.demandScore}/10</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${selectionCount > 0 ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
        <div className="bg-slate-900 text-white rounded-full p-2 pl-6 pr-2 shadow-2xl flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-300 uppercase tracking-widest text-xs">Selection</span>
            <span className="font-bold">
              {selectionCount === 1 ? '1 Path Selected' : '2 Paths to Blend'}
            </span>
          </div>
          
          <button 
            onClick={onConfirm}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/30"
          >
            {selectionCount === 2 ? (
              <>
                <GitMerge size={20} />
                Blend & Architect
              </>
            ) : (
              <>
                View Blueprint
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};