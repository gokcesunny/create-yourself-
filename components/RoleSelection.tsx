import React from 'react';
import { GeneratedRole } from '../types';
import { Target, Zap, Rocket, Feather, Check, TrendingUp, ArrowRight } from 'lucide-react';

interface RoleSelectionProps {
  roles: GeneratedRole[];
  onSelectRole: (role: GeneratedRole) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ roles, onSelectRole }) => {
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 mb-4">
          Your Future, Architected
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          We analyzed your profile and designed four distinct paths. 
          Choose the one that resonates most to generate your execution blueprint.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role, idx) => (
          <div 
            key={role.id || idx}
            onClick={() => onSelectRole(role)}
            className="group relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className={`absolute top-0 right-0 px-4 py-2 bg-slate-100 rounded-bl-xl text-xs font-bold uppercase tracking-wider text-slate-500`}>
              {getBadge(idx)}
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                {getIcon(idx)}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {role.title}
            </h3>
            <p className="text-sm font-medium text-indigo-500 mb-4 font-mono">
              {role.tagline}
            </p>
            
            <p className="text-slate-600 mb-6 line-clamp-3">
              {role.description}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
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

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Innovation Factor</span>
                <p className="text-sm text-slate-700 italic border-l-2 border-indigo-200 pl-3">
                  "{role.innovativeFactor}"
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View Blueprint</span>
              <ArrowRight size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};